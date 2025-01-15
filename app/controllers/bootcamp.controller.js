const {
  users,
  bootcamps
} = require('../models')
const db = require('../models')
const Bootcamp = db.bootcamps
const User = db.users

exports.createBootcamp = async (req, res) => {
  try {
    if (!req.body.title || !req.body.cue || !req.body.description) {
      return res.status(400).send({ message: "Todos los campos son obligatorios" });
    }

    const bootcamp = await Bootcamp.create({
      title: req.body.title,
      cue: req.body.cue,
      description: req.body.description,
      userId: req.userId, 
    });

    res.status(201).send({
      message: "Bootcamp creado exitosamente",
      bootcamp,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Agregar un Usuario al Bootcamp
exports.addUser = (bootcampId, userId) => {
  return Bootcamp.findByPk(bootcampId)
    .then((bootcamp) => {
      if (!bootcamp) {
        console.log("No se encontro el Bootcamp!");
        return null;
      }
      return User.findByPk(userId).then((user) => {
        if (!user) {
          console.log("Usuario no encontrado!");
          return null;
        }
        bootcamp.addUser(user);
        console.log('***************************')
        console.log(` Agregado el usuario id=${user.id} al bootcamp con id=${bootcamp.id}`);
        console.log('***************************')
        return bootcamp;
      });
    })
    .catch((err) => {
      console.log(">> Error mientras se estaba agregando Usuario al Bootcamp", err);
    });
};


// obtener los bootcamp por id 
exports.findById = (Id) => {
  return Bootcamp.findByPk(Id, {
    include: [{
      model: User,
      as: "users",
      attributes: ["id", "firstName", "lastName"],
      through: {
        attributes: [],
      }
    },],
  })
    .then(bootcamp => {
      return bootcamp
    })
    .catch(err => {
      console.log(`>> Error mientras se encontraba el bootcamp: ${err}`)
    })
}

// obtener todos los Usuarios incluyendo los Bootcamp
exports.findAll = () => {
  return Bootcamp.findAll({
    include: [{
      model: User,
      as: "users",
      attributes: ["id", "firstName", "lastName"],
      through: {
        attributes: [],
      }
    },],
  }).then(bootcamps => {
    return bootcamps
  }).catch((err) => {
    console.log(">> Error Buscando los Bootcamps: ", err);
  });
}