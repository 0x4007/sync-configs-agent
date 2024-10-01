# `@ubiquity/sync-configs`

Use ChatGPT to modify our three org configs using plain english!

```
m1:sync-configs nv$ bun run tsx src/
Cloning https://github.com/ubiquity/ubiquibot-config.git
Cloning https://github.com/ubiquity-os/ubiquibot-config.git
Cloning https://github.com/ubiquity-os-marketplace/ubiquibot-config.git
✔ Enter the changes you want to make (in plain English): make sure to set all max concurrent tasks to 3 for
everyy role



Differences for /Users/nv/repos/0x4007/sync-configs/src/repos/ubiquity/.github/.ubiquibot-config.yml:
--- /Users/nv/repos/0x4007/sync-configs/src/repos/ubiquity/.github/.ubiquibot-config.yml        2024-10-01 16:13:28
+++ /Users/nv/repos/0x4007/sync-configs/src/repos/ubiquity/.github/.ubiquibot-config.yml.modified       2024-10-01 16:15:42
@@ -1,3 +1,7 @@
+Sure, here is your modified YAML file:
+
+```yaml
+---
 plugins:
   - uses:
     - plugin: https://ubiquibot-command-start-stop-development.ubiquity.workers.dev
\ No newline at end of file
@@ -6,9 +10,9 @@
         taskStaleTimeoutDuration: "30 Days"
         startRequiresWallet: true # default is true
         maxConcurrentTasks:
-          admin: 100
-          member: 20
-          contributor: 5
+          admin: 3
+          member: 3
+          contributor: 3
   - uses:
     - plugin: https://ubiquibot-command-wallet-development.ubiquity.workers.dev
   - uses:
\ No newline at end of file
@@ -123,3 +127,6 @@
             - production
   - uses:
     - plugin: ubiquibot/issue-comment-embeddings@main
+---
+
+```
\ No newline at end of file

✔ Do you want to apply these changes to https://github.com/ubiquity/ubiquibot-config.git? yes
Changes pushed to https://github.com/ubiquity/ubiquibot-config.git

Differences for /Users/nv/repos/0x4007/sync-configs/src/repos/ubiquity-os/.github/.ubiquibot-config.yml:
--- /Users/nv/repos/0x4007/sync-configs/src/repos/ubiquity-os/.github/.ubiquibot-config.yml     2024-10-01 16:13:30
+++ /Users/nv/repos/0x4007/sync-configs/src/repos/ubiquity-os/.github/.ubiquibot-config.yml.modified    2024-10-01 16:16:32
@@ -1,3 +1,4 @@
+---
 plugins:
   - uses:
     - plugin: https://ubiquity-os-comment-vector-embeddings-development.ubiquity.workers.dev
\ No newline at end of file
@@ -121,6 +122,8 @@
         taskStaleTimeoutDuration: "30 Days"
         startRequiresWallet: true # default is true
         maxConcurrentTasks:
-          admin: 100
-          member: 20
-          contributor: 5
+          admin: 3
+          member: 3
+          contributor: 3
+
+---
\ No newline at end of file

✔ Do you want to apply these changes to https://github.com/ubiquity-os/ubiquibot-config.git? yes
Changes pushed to https://github.com/ubiquity-os/ubiquibot-config.git

Differences for /Users/nv/repos/0x4007/sync-configs/src/repos/ubiquity-os-marketplace/.github/.ubiquibot-config.yml:
--- /Users/nv/repos/0x4007/sync-configs/src/repos/ubiquity-os-marketplace/.github/.ubiquibot-config.yml 2024-10-01 16:13:32
+++ /Users/nv/repos/0x4007/sync-configs/src/repos/ubiquity-os-marketplace/.github/.ubiquibot-config.yml.modified   2024-10-01 16:17:37
@@ -1,3 +1,4 @@
+---
 plugins:
   - uses:
     - plugin: https://ubiquity-os-comment-vector-embeddings-development.ubiquity.workers.dev
\ No newline at end of file
@@ -119,8 +120,9 @@
         taskStaleTimeoutDuration: "30 Days"
         startRequiresWallet: true # default is true
         maxConcurrentTasks:
-          admin: 100
-          member: 20
-          contributor: 5
+          admin: 3
+          member: 3
+          contributor: 3
   - uses:
     - plugin: ubiquibot/issue-comment-embeddings@development
+---
\ No newline at end of file

✔ Do you want to apply these changes to https://github.com/ubiquity-os-marketplace/ubiquibot-config.git? yes
Changes pushed to https://github.com/ubiquity-os-marketplace/ubiquibot-config.git
undefined
m1:sync-configs nv$
```