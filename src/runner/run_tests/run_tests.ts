// brian taylor vann
// run tests

// TODO:
// use performance.now() when nodejs is dead

import { Assertions, TestUnit } from "../../results_store/results_store.ts";
import { sendTestResult, startTest } from "../relay_results/relay_results.ts";
import { getStub } from "../receipt/receipt.ts";

type CreateTestTimeout = (requestedInterval?: number) => Promise<Assertions>;
type LtrTest = () => Promise<void>;
type BuildLtrTestParams = {
  collectionID: number;
  issuedAt: number;
  testFunc: TestUnit;
  testID: number;
  timeoutInterval?: number;
};
type BuildLtrTest = (params: BuildLtrTestParams) => LtrTest;
interface RunTestsParams {
  timeoutInterval?: number;
  tests: TestUnit[];
  collectionID: number;
  startTime: number;
}
type RunTests = (params: RunTestsParams) => Promise<void>;

const sleep = (time: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const defaultTimeoutInterval = 10000;
const getTimeoutAssertions = (timeoutInterval: number) => [
  `timed out at: ${timeoutInterval}`,
];

const createTestTimeout: CreateTestTimeout = async (
  timeoutInterval?: number
) => {
  const interval = timeoutInterval ?? defaultTimeoutInterval;
  await sleep(interval);
  return getTimeoutAssertions(interval);
};

const buildTest: BuildLtrTest = (params) => {
  const { issuedAt, testID, collectionID, timeoutInterval } = params;
  return async () => {
    if (issuedAt < getStub()) {
      return;
    }

    const startTime = performance.now();
    startTest({
      collectionID,
      testID,
      startTime,
    });

    const assertions = await Promise.race([
      params.testFunc(),
      createTestTimeout(timeoutInterval),
    ]);

    if (issuedAt < getStub()) {
      return;
    }
    const endTime = performance.now();
    sendTestResult({
      endTime,
      assertions,
      collectionID,
      testID,
    });
  };
};

const runTestsAllAtOnce: RunTests = async ({
  startTime,
  collectionID,
  tests,
  timeoutInterval,
}) => {
  const builtAsyncTests = [];

  let testID = 0;
  for (const testFunc of tests) {
    builtAsyncTests.push(
      buildTest({
        collectionID,
        issuedAt: startTime,
        testFunc,
        testID,
        timeoutInterval,
      })() // execute test before push
    );
    testID += 1;
  }

  if (startTime < getStub()) {
    return;
  }

  await Promise.all(builtAsyncTests);
};

const runTestsInOrder: RunTests = async ({
  startTime,
  collectionID,
  tests,
  timeoutInterval,
}) => {
  let testID = 0;
  for (const testFunc of tests) {
    if (startTime < getStub()) {
      return;
    }
    const builtTest = buildTest({
      collectionID,
      issuedAt: startTime,
      testFunc,
      testID,
      timeoutInterval,
    });

    await builtTest();
    testID += 1;
  }
};

export { runTestsAllAtOnce, runTestsInOrder };
