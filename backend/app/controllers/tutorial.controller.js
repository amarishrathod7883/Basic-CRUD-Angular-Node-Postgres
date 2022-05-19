const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

// Create and Save new Tutorial
exports.create = (req, res) => {
  console.log("req.body");

  // Validate request
  if (!!req.body.title) {
    Tutorial.findOne({ where: {title: req.body.title} })
    .then(data => {
      console.log("error", data);
      if(data != null)
      {
        console.log("here");
        var content = {
          success: false,
          message: "Title already exist."
        };
        res.send(content);
      }
      else
      {
        // Create Tutorial
        const tutorial = {
          title: req.body.title,
          description: req.body.description,
          published: req.body.published ? req.body.published : false,
        };

        // Save Tutorial in the database
        Tutorial.create(tutorial)
          .then(data => {
            var content = {
              data: data,
              success: true,
            };
            res.send(content);
          })
          .catch(err => {
            res.status(500).send({
              message: 
                err.message || "Some error occurred while creating yhe tutorial."
            });
          });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorial."
      });
    });
  }

  
};

// Retrieve all Tutorials from database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
  
  Tutorial.findAll({ 
    where: condition,
    order: [
      ['id', 'ASC'],
    ],
    attributes: ['id', 'title', 'description', 'published'] 
  })
  .then(data => {
    var content = {
      data: data,
      success: true,
    };
    res.send(content);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving tutorials."
    });
  });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Tutorial.findByPk(id)
    .then(data => {
      if (data) {
        var content = {
          data: data,
          success: true,
        };
        res.send(content);
      } else {
        res.status(404).send({
          message: `Cannot find Tutorial with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Tutorial.findOne({ 
    where: {
      title: req.body.title,
      id: { 
        [Op.ne]: id 
      }
    }
  })
  .then(data => {
    console.log("error", data);
    if(data != null)
    {
      console.log("here");
      var content = {
        success: false,
        message: "Title already exist."
      };
      res.send(content);
    }
    else
    {
      Tutorial.update(req.body, {
        where: { id: id }
      })
      .then(num => {
        console.log("num", num);
        if (num == 1) {
          var content = {
            success: true,
            message: "Tutorial was updated successfully."
          };
          res.send(content);
        } 
        else {
          var content = {
            success: false,
            message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
          };
          res.send(content);
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Tutorial with id=" + id
        });
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error checking Tutorial with id=" + id
    });
  });
};

// Delete a Tutorial with specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Tutorial.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        var content = {
          success: true,
          message: "Tutorial was deleted successfully."
        };
        res.send(content);
      } else {
        var content = {
          success: false,
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        };
        res.send(content);
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      var content = {
        success: true,
        message: `${nums} Tutorials were deleted successfully!`
      };
      res.send(content);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Tutorial.findAll({ where: { published: true } })
    .then(data => {
      var content = {
        data: data,
        success: true
      };
      res.send(content);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};