import { syncConfigsAgent } from "./sync-configs/sync-configs";

void syncConfigsAgent().then(console.log).catch(console.error);
