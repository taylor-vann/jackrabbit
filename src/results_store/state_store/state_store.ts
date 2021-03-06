// brian taylor vann
// state store

import type { TestRunResults } from "./state_types/state_types.ts";
import type {
  EndTestActionParams,
  EndTestCollectionActionParams,
  EndTestRunActionParams,
  StartTestActionParams,
  StartTestCollectionActionParams,
  StartTestRunActionParams,
} from "../action_types/actions_types.ts";

import { copycopy } from "../../copycopy/copycopy.ts";
import { buildResultsState } from "./build_state/build_state.ts";
import { startTestCollectionState } from "./start_test_collection_state/start_test_collection_state.ts";
import { startTestState } from "./start_test_state/start_test_state.ts";
import { cancelRunState } from "./cancel_run_state/cancel_run_state.ts";
import { endTestCollectionState } from "./end_test_collection_state/end_test_collection_state.ts";
import { endTestState } from "./end_test_state/end_test_state.ts";
import { endTestRunState } from "./end_test_run_state/end_test_run_state.ts";

type BuildResults = (params: StartTestRunActionParams) => void;
type StartTestCollection = (params: StartTestCollectionActionParams) => void;
type StartTest = (params: StartTestActionParams) => void;
type CancelRun = (params: EndTestRunActionParams) => void;
type EndTest = (params: EndTestActionParams) => void;
type EndTestCollection = (params: EndTestCollectionActionParams) => void;
type EndTestRun = (params: EndTestRunActionParams) => void;

type GetResults = () => TestRunResults;

const defaultResultsState: TestRunResults = {
  status: "unsubmitted",
};

let resultsState: TestRunResults = { ...defaultResultsState };

const buildResults: BuildResults = (params) => {
  resultsState = buildResultsState(params);
};

const startTestCollection: StartTestCollection = (params) => {
  const copyOfResults = copycopy<TestRunResults>(resultsState);
  resultsState = startTestCollectionState(copyOfResults, params);
};

const startTest: StartTest = (params) => {
  const copyOfResults = copycopy<TestRunResults>(resultsState);
  resultsState = startTestState(copyOfResults, params);
};

const cancelRun: CancelRun = (params) => {
  const copyOfResults = copycopy<TestRunResults>(resultsState);
  resultsState = cancelRunState(copyOfResults, params);
};

const endTest: EndTest = (params) => {
  const copyOfResults = copycopy<TestRunResults>(resultsState);
  resultsState = endTestState(copyOfResults, params);
};

const endTestCollection: EndTestCollection = (params) => {
  const copyOfResults = copycopy<TestRunResults>(resultsState);
  resultsState = endTestCollectionState(copyOfResults, params);
};

const endTestRun: EndTestRun = (params) => {
  const copyOfResults = copycopy<TestRunResults>(resultsState);
  resultsState = endTestRunState(copyOfResults, params);
};

const getResults: GetResults = () => {
  return copycopy<TestRunResults>(resultsState);
};

export {
  buildResults,
  cancelRun,
  endTest,
  endTestCollection,
  endTestRun,
  getResults,
  startTest,
  startTestCollection,
};
