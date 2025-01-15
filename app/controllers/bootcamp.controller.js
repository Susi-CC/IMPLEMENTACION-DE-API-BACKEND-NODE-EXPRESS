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
    });

    res.status(201).send({
      message: "Bootcamp creado exitosamente",
      bootcamp,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { bootcampId, userId } = req.body;

    const bootcamp = await Bootcamp.findByPk(bootcampId);
    const user = await User.findByPk(userId);

    if (!bootcamp) {
      return res.status(404).send({ message: "Bootcamp no encontrado" });
    }

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    await bootcamp.addUser(user);

    const message = `
***************************
 Agregado el usuario id=${user.id} al bootcamp con id=${bootcamp.id}
***************************
`;

    res.status(200).send({ message });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getAllBootcamps = async (req, res) => {
  try {
    const bootcamps = await Bootcamp.findAll({
      attributes: ["id", "title", "cue", "description"] 
    });
    res.status(200).send(bootcamps);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getBootcampById = async (req, res) => {
    try {
        const bootcampId = parseInt(req.params.id, 10);
        if (!req.params.id) {
            return res.status(400).send({ message: "El ID del bootcamp es obligatorio" });
        }

        if (isNaN(bootcampId)) {
            return res.status(400).send({ message: "El ID del bootcamp debe ser un número válido" });
        }

        const bootcamp = await Bootcamp.findByPk(bootcampId, 
          {
            attributes: ["id", "title", "cue", "description"], 
            include: [{
                model: User,
                as: "users", 
                attributes: ["id", "firstName", "lastName", "email"], 
                through: { attributes: [] } 
            }]
        });

        if (!bootcamp) {
            return res.status(404).send({ message: "Bootcamp no encontrado" });
        }

        res.status(200).send(bootcamp);
    } catch (err) {
        console.error(">> Error en getBootcampById:", err.message);
        res.status(500).send({ message: "Error al obtener el bootcamp" });
    }
};
