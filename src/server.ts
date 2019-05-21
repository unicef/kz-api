import app from "./app";
const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(
    "App is running on http://localhost:%d in %s mode",
    PORT,
    process.env.NODE_ENV
  );
});

export default server;