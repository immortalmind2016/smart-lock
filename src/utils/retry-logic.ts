const sleep = (seconds: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(seconds);
    }, seconds * 1000);
  });
export const retryLogic = (fn, ...args) => {
  const logic = async (fn, retryNo = 0, ...args) => {
    console.log({ retryNo });
    if (retryNo == 4) {
      throw new Error("reached the maximum number of retrying");
    }
    let result;
    try {
      result = await fn(...args);
    } catch (e) {
      await sleep(retryNo);
      result = await logic(fn, retryNo + 1, ...args);
    }

    return result;
  };

  return logic(fn, 0, ...args);
};

const testFunction = async (x, y) => {
  if (x == 5) {
    return Promise.resolve(x + y);
  } else {
    return Promise.reject(1000);
  }
};
const testCode = async () => {
  console.log(await retryLogic(testFunction, 2, 2));
};
