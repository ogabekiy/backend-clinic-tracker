const green = "\x1b[32m";
const reset = "\x1b[0m";

export function printEndpoints(endpoints) {
  console.log(`${green}\nAvailable endpoints:`);

  endpoints.forEach(({ method, path }) => {
    console.log(`${method.padEnd(6)} ${path}`);
  });

  console.log(reset);
}

