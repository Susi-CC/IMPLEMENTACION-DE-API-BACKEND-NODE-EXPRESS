const {
  users
} = require('../models')
const db = require('../models')
const User = db.users
const Bootcamp = db.bootcamps
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

exports.signup = async (req, res) => {
    try {
        if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
            return res.status(400).send({ message: "Todos los campos son obligatorios" });
        }

        if (req.body.password.length < 8) {
            return res.status(400).send({ message: "La contraseña debe tener al menos 8 caracteres" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).send({ message: "El formato del correo electrónico no es válido" });
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
        console.error(">> Error en signup:", err.message);
        res.status(500).send({ message: "Error interno del servidor" });
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

    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 }); 

    res.status(200).send({ 
      message: "Sesión iniciada correctamente",
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accessToken: token,});
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const findUserById = async (userId) => {
  if (!userId || typeof userId !== "number") {
      console.error(">> El ID proporcionado no es válido:", userId);
      throw new Error("El ID proporcionado no es válido");
  }

  try {
      console.log(`>> Buscando usuario con ID=${userId}`);
      const user = await User.findByPk(userId, {
        attributes: ["id", "firstName", "lastName", "email"],
          include: [{
              model: Bootcamp,
              as: "bootcamps",
              attributes: ["id", "title"],
              through: { attributes: [] }
          }],
      });

      if (!user) {
          console.log(`>> Usuario con ID=${userId} no encontrado.`);
      } else {
          console.log(`>> Usuario encontrado: ${JSON.stringify(user)}`);
      }

      return user;
  } catch (err) {
      console.error(`>> Error al buscar usuario con ID=${userId}: ${err.message}`);
      throw err;
  }
};
exports.getUserWithBootcamps = async (req, res) => {
  try {
      const userId = parseInt(req.params.userId, 10); 

      if (isNaN(userId)) {
          console.error(">> ID del usuario no es un número válido:", req.params.userId);
          return res.status(400).send({ message: "El ID del usuario debe ser un número válido" });
      }

      console.log(`>> Solicitando datos del usuario con ID=${userId}`);
      const user = await findUserById(userId);

      if (!user) {
          return res.status(404).send({ message: "Usuario no encontrado" });
      }

      res.status(200).send(user);
  } catch (err) {
      console.error(`>> Error en getUserWithBootcamps: ${err.message}`);
      res.status(500).send({ message: "Error al obtener el usuario" });
  }
};

const findAll = async () => {
  try {
      const users = await User.findAll({
        attributes: ["id", "firstName", "lastName", "email"],
          include: [{
              model: Bootcamp,
              as: "bootcamps", 
              attributes: ["id", "title"], 
              through: {
                  attributes: [], 
              },
          }],
      });

      return users;
  } catch (err) {
      console.error(">> Error al obtener todos los usuarios con bootcamps:", err.message);
      throw err; 
  }
};

exports.getAllUsersWithBootcamps = async (req, res) => {
  try {
      const users = await findAll();

      if (!users || users.length === 0) {
          return res.status(404).send({ message: "No se encontraron usuarios" });
      }

      res.status(200).send(users);
  } catch (err) {
      console.error(">> Error en getAllUsersWithBootcamps:", err.message);
      res.status(500).send({ message: "Error al obtener los usuarios con bootcamps" });
  }
};

exports.updateUserById = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10); 

        if (isNaN(userId)) {
            console.error(">> ID del usuario no es un número válido:", req.params.userId);
            return res.status(400).send({ message: "El ID del usuario debe ser un número válido" });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        const fieldsToUpdate = {};
        if (req.body.firstName) fieldsToUpdate.firstName = req.body.firstName;
        if (req.body.lastName) fieldsToUpdate.lastName = req.body.lastName;

        if (req.body.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(req.body.email)) {
                return res.status(400).send({ message: "El formato del correo electrónico no es válido" });
            }

            const existingUser = await User.findOne({ where: { email: req.body.email } });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).send({ message: "El correo ya está en uso" });
            }

            fieldsToUpdate.email = req.body.email;
        }

        if (req.body.password) {
            if (req.body.password.length < 8) {
                return res.status(400).send({ message: "La contraseña debe tener al menos 8 caracteres" });
            }
            fieldsToUpdate.password = bcrypt.hashSync(req.body.password, 8);
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).send({ message: "No se proporcionaron campos para actualizar" });
        }

        const updatedUser = await user.update(fieldsToUpdate);

        res.status(200).send({
            message: "Usuario actualizado correctamente",
            user: {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
            },
        });
    } catch (err) {
        console.error(">> Error en updateUserById:", err.message);
        res.status(500).send({ message: "Error al actualizar el usuario" });
    }
};

exports.deleteUserById = async (req, res) => {
  try {
      const userId = parseInt(req.params.userId, 10); 
      if (isNaN(userId)) {
          console.error(">> ID del usuario no es un número válido:", req.params.userId);
          return res.status(400).send({ message: "El ID del usuario debe ser un número válido" });
      }

      const user = await User.findByPk(userId);
      if (!user) {
          return res.status(404).send({ message: "Usuario no encontrado" });
      }

      if (req.userId !== userId) {
          return res.status(403).send({ message: "No tienes permiso para eliminar este usuario" });
      }

      await user.destroy();

      res.status(200).send({ message: "Usuario eliminado correctamente" });
  } catch (err) {
      console.error(">> Error en deleteUserById:", err.message);
      res.status(500).send({ message: "Error al eliminar el usuario" });
  }
};