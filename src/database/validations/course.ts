export const isNotOnlyNumbers = (value: string): void => {
  if (/^\d+$/.test(value)) {
    throw new Error("Course name cannot be only numbers");
  }
};
