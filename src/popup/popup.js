import { ChromeStorageSettingsRepository } from "../settings/ChromeStorageSettingsRepository.js";
import { ActiveTabNotebookClient } from "./ActiveTabNotebookClient.js";
import { PopupView } from "./PopupView.js";
import { PopupController } from "./PopupController.js";

new PopupController({
  view: new PopupView(),
  settingsRepository: new ChromeStorageSettingsRepository(),
  notebookClient: new ActiveTabNotebookClient(),
}).init();
