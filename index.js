const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json());

const port = 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// List all tours
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};
// List any tour for id
const getTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: "Fail",
      message: "Invalid ID",
    });
  }
  const tourData = tours.find((el) => el.id === id);

  res.status(200).json({
    status: "success",
    data: {
      tourData,
    },
  });
};

const addNewTour = (req, res) => {
  const newTourID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newTourID }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "Fail",
      message: "Invalid ID",
    });
  }
  res.status(201).json({
    status: "success",
    message: "Tour updated",
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "Fail",
      message: "Invalid ID",
    });
  }
  res.status(201).json({
    status: "success",
    message: "Tour is deleted",
  });
};

app.route("/api/v1/tours").get(getAllTours).post(addNewTour);
app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
app.listen(port, () => {
  console.log(`App running on port ${port} 💩`);
});
