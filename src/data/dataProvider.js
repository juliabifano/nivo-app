import { localRepository } from "./localRepository";
import { apiRepository } from "./apiRepository";

const MODE = "local"; // depois você troca pra "api"

export const dataProvider =
  MODE === "api" ? apiRepository : localRepository;