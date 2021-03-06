// brian taylor vann
// end test run state

import type {
  CollectionResults,
  TestRunResults,
} from "../state_types/state_types.ts";
import type { EndTestRunActionParams } from "../../action_types/actions_types.ts";

type AllTestCollectionsHavePassed = (
  collectionResults: CollectionResults
) => boolean;
type EndTestRun = (
  results: TestRunResults,
  params: EndTestRunActionParams
) => TestRunResults;

// for test collection
const allTestCollectionsHavePassed: AllTestCollectionsHavePassed = (
  collectionResults
) => {
  for (const collection of collectionResults) {
    if (collection.status === "failed") {
      return false;
    }
  }
  return true;
};

const endTestRunState: EndTestRun = (runResults, params) => {
  const { endTime } = params;
  runResults.endTime = endTime;
  runResults.status = "failed";

  const results = runResults.results;
  if (results && allTestCollectionsHavePassed(results)) {
    runResults.status = "passed";
  }

  return runResults;
};

export { endTestRunState };
