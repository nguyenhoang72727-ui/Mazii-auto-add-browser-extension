import { ChromeStorageSettingsRepository } from "../settings/ChromeStorageSettingsRepository.js";
import { MaziiEndpoints } from "../gateway/MaziiEndpoints.js";
import { AuthTokenProvider } from "../gateway/AuthTokenProvider.js";
import { MaziiHttpClient } from "../gateway/MaziiHttpClient.js";
import { PageAuthHeaders } from "../gateway/PageAuthHeaders.js";
import { CompositeAuthHeaders } from "../gateway/CompositeAuthHeaders.js";
import { MaziiNotebookGateway } from "../gateway/MaziiNotebookGateway.js";
import { PageMessageSource } from "../lookup/PageMessageSource.js";
import { HistoryLookupDetector } from "../lookup/HistoryLookupDetector.js";
import { RecentWordsGuard } from "../services/RecentWordsGuard.js";
import { AutoAddService } from "../services/AutoAddService.js";
import { ToastNotifier } from "../ui/ToastNotifier.js";
import { MessageRouter } from "./MessageRouter.js";
import { MessageType } from "../shared/constants.js";

// Composition root: nơi duy nhất biết các lớp cụ thể.
const authHeaders = new CompositeAuthHeaders([new PageAuthHeaders(), new AuthTokenProvider()]);
const gateway = new MaziiNotebookGateway(new MaziiHttpClient(authHeaders), new MaziiEndpoints());

const service = new AutoAddService({
  settingsRepository: new ChromeStorageSettingsRepository(),
  gateway,
  lookupDetector: new HistoryLookupDetector(new PageMessageSource()),
  notifier: new ToastNotifier(),
  guard: new RecentWordsGuard(),
});

new MessageRouter()
  .register(MessageType.LIST_NOTEBOOKS, async () =>
    (await gateway.listNotebooks()).map((n) => n.toJSON()),
  )
  .listen();

service.start();
