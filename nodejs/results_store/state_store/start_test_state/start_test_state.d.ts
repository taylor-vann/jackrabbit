import { TestRunResults } from "../state_types/state_types";
import { StartTestActionParams } from "../../action_types/actions_types";
declare type StartTest = (results: TestRunResults, params: StartTestActionParams) => TestRunResults;
declare const startTestState: StartTest;
export { startTestState };