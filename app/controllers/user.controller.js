const {
  users
} = require('../models')
const db = require('../models')
const User = db.users
const Bootcamp = db.bootcamps
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

// Crear y Guardar Usuarios
exports.createUser = (user) => {
  return User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    })
    .then(user => {
      console.log(`>> Se ha creado el usuario: ${JSON.stringify(user, null, 4)}`)
      return user
    })
    .catch(err => {
      console.log(`>> Error al crear el usuario ${err}`)
    })
}

// obtener los bootcamp de un usuario
exports.findUserById = (userId) => {
  return User.findByPk(userId, {
      include: [{
        model: Bootcamp,
        as: "bootcamps",
        attributes: ["id", "title"],
        through: {
          attributes: [],
        }
      }, ],
    })
    .then(users => {
      return users
    })
    .catch(err => {
      console.log(`>> Error mientras se encontraba los usuarios: ${err}`)
    })
}

// obtener todos los Usuarios incluyendo los bootcamp
exports.findAll = () => {
  return User.findAll({
    include: [{
      model: Bootcamp,
      as: "bootcamps",
      attributes: ["id", "title"],
      through: {
        attributes: [],
      }
    }, ],
  }).then(users => {
    return users
  })
}

// Actualizar usuarios
exports.updateUserById = (userId, fName, lName) => {
  return User.update({
      firstName: fName,
      lastName: lName
    }, {
      where: {
        id: userId
      }
    })
    .then(user => {
      console.log(`>> Se ha actualizado el usuario: ${JSON.stringify(user, null, 4)}`)
      return user
    })
    .catch(err => {
      console.log(`>> Error mientras se actualizaba el usuario: ${err}`)
    })
}

// Actualizar usuarios
exports.deleteUserById = (userId) => {
  return User.destroy({
      where: {
        id: userId
      }
    })
    .then(user => {
      console.log(`>> Se ha eliminado el usuario: ${JSON.stringify(user, null, 4)}`)
      return user
    })
    .catch(err => {
      console.log(`>> Error mientras se eliminaba el usuario: ${err}`)
    })
}


// Lo de mi tarea

exports.signup = async (req, res) => {
  try {
      if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
          return res.status(400).send({ message: "Todos los campos son obligatorios" });
      }

      if (req.body.password.length < 8) {
          return res.status(400).send({ message: "La contraseña debe tener al menos 8 caracteres" });
      }

      const existingUser = await User.findOne({ where: { email: req.body.email } });
      if (existingUser) {
          return res.status(400).send({ message: "El correo ya está en uso" });
      }

      const hashedPassword = bcrypt.hashSync(req.body.password, 8);

      const user = await User.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hashedPassword,
      });

      res.status(201).send({
          message: "Usuario registrado exitosamente",
          user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
          },
      });
  } catch (err) {
      res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
      if (!req.body.email || !req.body.password) {
          return res.status(400).send({ message: "El correo y la contraseña son obligatorios" });
      }

      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) {
          return res.status(401).send({ message: "Correo o contraseña incorrectos" });
      }

      const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
      if (!isPasswordValid) {
          return res.status(401).send({ message: "Correo o contraseña incorrectos" });
      }

      const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 }); // Expira en 24 horas

      res.status(200).send({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          accessToken: token,
      });
  } catch (err) {
      res.status(500).send({ message: err.message });
  }
};
