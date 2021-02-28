import { TestRunResults } from "../state_types/state_types";
import { EndTestActionParams } from "../../action_types/actions_types";
declare type EndTest = (results: TestRunResults, params: EndTestActionParams) => TestRunResults;
declare const endTestState: EndTest;
export { endTestState };