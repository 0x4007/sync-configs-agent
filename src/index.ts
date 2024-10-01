import { syncConfigs } from "./sync-configs/sync-configs";

void syncConfigs().then(console.log).catch(console.error);
