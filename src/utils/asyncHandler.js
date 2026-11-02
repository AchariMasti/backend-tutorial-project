// Keeps controller code readable by forwarding rejected promises to Express.
export const asyncHandler = (controller) => (req, res, next) => {
  Promise.resolve(controller(req, res, next)).catch(next);
};
