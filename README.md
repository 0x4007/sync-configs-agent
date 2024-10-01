# `@ubiquity/sync-configs`

Use Claude 3.5 Sonnet to modify our three org configs using plain english!

```shell
m1:sync-configs nv$ bun run start
$ tsx src/index.ts
✔ Enter the changes you want to make (in plain English): help me ensure that every yml file is not malformed. if there are no mistakes make no changes. if there are mistakes, please fix. focus on syntax errors
plugins:
  - uses:
    - plugin: https://ubiquibot-command-start-stop-development.ubiquity.workers.dev
      with:
        reviewDelayTolerance: "3 Days"
        taskStaleTimeoutDuration: "30 Days"
        startRequiresWallet: true # default is true
        maxConcurrentTasks:
          admin: 3
          member: 3
          contributor: 3
  - uses:
    - plugin: https://ubiquibot-command-wallet-development.ubiquity.workers.dev
  - uses:
    - plugin: https://ubiquibot-command-query-user-development.ubiquity.workers.dev
      with:
        allowPublicQuery: true
  - uses:
    - plugin: https://ubiquibot-assistive-pricing-development.ubiquity.workers.dev
      with:
        labels:
          time:
            - "Time: <1 Hour"
            - "Time: <2 Hours"
            - "Time: <4 Hours"
            - "Time: <1 Day"
            - "Time: <1 Week"
            - "Time: <1 Month"
          priority:
            - "Priority: 1 (Normal)"
            - "Priority: 2 (Medium)"
            - "Priority: 3 (High)"
            - "Priority: 4 (Urgent)"
            - "Priority: 5 (Emergency)"
        basePriceMultiplier: 2
        publicAccessControl:
          setLabel: true
          fundExternalClosedIssue: false
  - skipBotEvents: false
    uses:
      - plugin: ubiquity-os-marketplace/conversation-rewards@fix/formatting-summary
        with:
          logLevel: "debug"
          evmNetworkId: 100
          evmPrivateEncrypted: "bd5AFnSCO6c5jJyPifpOfr5Zys29RE7SyXkEU3akT13RtGmYDrqGIGuvJQyH53HA5dIba7PL5bXfll0JebmwXYe5gHIXSGX80WuGMDHh0cFfeGjHhmUXe8kkZ1OT2De9qRpqejJcEzdfi-8XNAvP7cQu2Vt-7RNnPw" # https://github.com/ubiquibot/conversation-rewards/pull/111#issuecomment-2348639931
          incentives:
            contentEvaluator:
              enabled: true
            userExtractor:
              enabled: true
              redeemTask: true
            dataPurge:
              enabled: true
            formattingEvaluator:
              multipliers:
                - role: [ ISSUE_SPECIFICATION ]
                  multiplier: 3
                  rewards:
                    wordValue: 0.1
                - role: [ ISSUE_AUTHOR ]
                  multiplier: 1
                  rewards:
                    wordValue: 0.2
                - role: [ ISSUE_ASSIGNEE ]
                  multiplier: 1
                  rewards:
                    wordValue: 0.1
                - role: [ ISSUE_COLLABORATOR ]
                  multiplier: 1
                  rewards:
                    wordValue: 0.1
                - role: [ ISSUE_CONTRIBUTOR ]
                  multiplier: 0.25
                  rewards:
                    wordValue: 0.1
                - role: [ PULL_SPECIFICATION ]
                  multiplier: 0
                  rewards:
                    wordValue: 0
                - role: [ PULL_AUTHOR ]
                  multiplier: 0
                  rewards:
                    wordValue: 0.2
                - role: [ PULL_ASSIGNEE ]
                  multiplier: 1
                  rewards:
                    wordValue: 0.1
                - role: [ PULL_COLLABORATOR ]
                  multiplier: 1
                  rewards:
                    wordValue: 0.1
                - role: [ PULL_CONTRIBUTOR ]
                  multiplier: 0.25
                  rewards:
                    wordValue: 0.1
            permitGeneration: {}
            githubComment:
              post: true
              debug: false
  - uses:
    - plugin: ubiquity-os-marketplace/disqualifier@main
      with:
        watch:
          optOut:
            - ubiquibot
            - launch-party
            - staging
            - production
  - uses:
    - plugin: ubiquity-os-marketplace/automated-merging@main
      with:
        approvalsRequired:
          collaborator: 1
        mergeTimeout:
          collaborator: "3.5 days"
        repos:
          ignore:
            - ubiquibot
            - launch-party
            - staging
            - production
  - uses:
    - plugin: ubiquibot/issue-comment-embeddings@main
Differences for /Users/nv/repos/0x4007/sync-configs/src/organizations/ubiquity/.github/.ubiquibot-config.yml:
--- /Users/nv/repos/0x4007/sync-configs/src/organizations/ubiquity/.github/.ubiquibot-config.yml	2024-10-01 16:59:32
+++ /Users/nv/repos/0x4007/sync-configs/src/organizations/ubiquity/.github/.ubiquibot-config.yml.modified	2024-10-01 18:57:40
@@ -39,7 +39,6 @@
   - skipBotEvents: false
     uses:
       - plugin: ubiquity-os-marketplace/conversation-rewards@fix/formatting-summary
-        # we don't skip bot events so conversation rewards triggered by the bot also run
         with:
           logLevel: "debug"
           evmNetworkId: 100
\ No newline at end of file

✔ Do you want to apply these changes to https://github.com/ubiquity/ubiquibot-config.git? no
Changes to https://github.com/ubiquity/ubiquibot-config.git discarded.
plugins:
  - uses:
    - plugin: https://ubiquity-os-comment-vector-embeddings-development.ubiquity.workers.dev
  - uses:
    - plugin: https://ubiquibot-command-wallet-development.ubiquity.workers.dev
  - uses:
    - plugin: https://command-query-user-development.ubiquity.workers.dev
      with:
        allowPublicQuery: true
  - uses:
    - plugin: https://ubiquibot-assistive-pricing-development.ubiquity.workers.dev
      with:
        labels:
          time:
            - "Time: <1 Hour"
            - "Time: <2 Hours"
            - "Time: <4 Hours"
            - "Time: <1 Day"
            - "Time: <1 Week"
            - "Time: <2 Weeks"
            - "Time: <1 Month"
          priority:
            - "Priority: 1 (Normal)"
            - "Priority: 2 (Medium)"
            - "Priority: 3 (High)"
            - "Priority: 4 (Urgent)"
            - "Priority: 5 (Emergency)"
        basePriceMultiplier: 2
        publicAccessControl:
          setLabel: true
          fundExternalClosedIssue: false
  - uses:
    - plugin: ubiquity-os-marketplace/conversation-rewards@development
      skipBotEvents: false
      with:
        logLevel: "debug"
        evmNetworkId: 100
        evmPrivateEncrypted: "gdo_iiUND1poZaibNme5oUsG1g8RDEmtI41uLgZjxW8WwxnQZb0DHkOBcISuwobxyKEyzeGQC9KzjkWXv0_OCv-kuUHy4myWNIhs4j3odyvh1XUP7pZFeuVEiASmKQBGkzlKRii5dA0liXtHnhciZQi5N8E7-cdOMbA" # https://github.com/ubiquibot/conversation-rewards/pull/111#issuecomment-2348639931
        incentives:
          contentEvaluator:
            enabled: true
          userExtractor:
            enabled: true
            redeemTask: true
          dataPurge:
            enabled: true
          formattingEvaluator:
            multipliers:
              - role: [ ISSUE_SPECIFICATION ]
                multiplier: 3
                rewards:
                  wordValue: 0.1
              - role: [ ISSUE_AUTHOR ]
                multiplier: 1
                rewards:
                  wordValue: 0.2
              - role: [ ISSUE_ASSIGNEE ]
                multiplier: 1
                rewards:
                  wordValue: 0.1
              - role: [ ISSUE_COLLABORATOR ]
                multiplier: 1
                rewards:
                  wordValue: 0.1
              - role: [ ISSUE_CONTRIBUTOR ]
                multiplier: 0.25
                rewards:
                  wordValue: 0.1
              - role: [ PULL_SPECIFICATION ]
                multiplier: 0
                rewards:
                  wordValue: 0
              - role: [ PULL_AUTHOR ]
                multiplier: 0
                rewards:
                  wordValue: 0.2
              - role: [ PULL_ASSIGNEE ]
                multiplier: 1
                rewards:
                  wordValue: 0.1
              - role: [ PULL_COLLABORATOR ]
                multiplier: 1
                rewards:
                  wordValue: 0.1
              - role: [ PULL_CONTRIBUTOR ]
                multiplier: 0.25
                rewards:
                  wordValue: 0.1
          permitGeneration:
            enabled: true
          githubComment:
            post: true
            debug: false
  - uses:
    - plugin: ubiquity-os-marketplace/disqualifier@development
      with:
        watch:
          optOut:
            - ubiquibot
            - launch-party
            - staging
            - production
  - uses:
    - plugin: ubiquity-os-marketplace/automated-merging@development
      with:
        approvalsRequired:
          collaborator: 1
        mergeTimeout:
          collaborator: "3.5 days"
        repos:
          ignore:
            - ubiquibot
            - launch-party
            - staging
            - production
  - uses:
    - plugin: https://ubiquibot-command-start-stop-development.ubiquity.workers.dev
      with:
        reviewDelayTolerance: "3 Days"
        taskStaleTimeoutDuration: "30 Days"
        startRequiresWallet: true
        maxConcurrentTasks:
          admin: 3
          member: 3
          contributor: 3
Differences for /Users/nv/repos/0x4007/sync-configs/src/organizations/ubiquity-os/.github/.ubiquibot-config.yml:

✔ Do you want to apply these changes to https://github.com/ubiquity-os/ubiquibot-config.git? no
Changes to https://github.com/ubiquity-os/ubiquibot-config.git discarded.
plugins:
  - uses:
      - plugin: https://ubiquity-os-comment-vector-embeddings-development.ubiquity.workers.dev
  - uses:
      - plugin: https://ubiquibot-command-wallet-development.ubiquity.workers.dev
  - uses:
      - plugin: https://command-query-user-development.ubiquity.workers.dev
        with:
          allowPublicQuery: true
  - uses:
      - plugin: https://ubiquibot-assistive-pricing-development.ubiquity.workers.dev
        with:
          labels:
            time:
              - "Time: <1 Hour"
              - "Time: <2 Hours"
              - "Time: <4 Hours"
              - "Time: <1 Day"
              - "Time: <1 Week"
              - "Time: <1 Month"
            priority:
              - "Priority: 1 (Normal)"
              - "Priority: 2 (Medium)"
              - "Priority: 3 (High)"
              - "Priority: 4 (Urgent)"
              - "Priority: 5 (Emergency)"
          basePriceMultiplier: 2
          publicAccessControl:
            setLabel: true
            fundExternalClosedIssue: false
  - skipBotEvents: false
    uses:
      - plugin: ubiquity-os-marketplace/conversation-rewards@development
        with:
          logLevel: "debug"
          evmNetworkId: 100
          evmPrivateEncrypted: "giLxu7IVSTpEFO89DaeCgnkKemYf2aFlK9EUQkbt71YmFOcQdIkCT8JDpX5zV5Sg1TqBeziZ486U0E3a6nD3emg0x9oeG3ILRUTlOE4I3RBZ0yTadsnV4RvewJMCMZJaYDuom-rHzog8p9InBwaHBszFeWItttSwS7o" # https://github.com/ubiquibot/conversation-rewards/pull/111#issuecomment-2348639931
          incentives:
            contentEvaluator:
              enabled: true
            userExtractor:
              enabled: true
              redeemTask: true
            dataPurge:
              enabled: true
            formattingEvaluator:
              multipliers:
                - role: [ ISSUE_SPECIFICATION ]
                  multiplier: 3
                  rewards:
                    wordValue: 0.1
                - role: [ ISSUE_AUTHOR ]
                  multiplier: 1
                  rewards:
                    wordValue: 0.2
                - role: [ ISSUE_ASSIGNEE ]
                  multiplier: 1
                  rewards:
                    wordValue: 0.1
                - role: [ ISSUE_COLLABORATOR ]
                  multiplier: 1
                  rewards:
                    wordValue: 0.1
                - role: [ ISSUE_CONTRIBUTOR ]
                  multiplier: 0.25
                  rewards:
                    wordValue: 0.1
                - role: [ PULL_SPECIFICATION ]
                  multiplier: 0
                  rewards:
                    wordValue: 0
                - role: [ PULL_AUTHOR ]
                  multiplier: 0
                  rewards:
                    wordValue: 0.2
                - role: [ PULL_ASSIGNEE ]
                  multiplier: 1
                  rewards:
                    wordValue: 0.1
                - role: [ PULL_COLLABORATOR ]
                  multiplier: 1
                  rewards:
                    wordValue: 0.1
                - role: [ PULL_CONTRIBUTOR ]
                  multiplier: 0.25
                  rewards:
                    wordValue: 0.1
            permitGeneration:
              enabled: true
            githubComment:
              post: true
              debug: false
  - uses:
      - plugin: ubiquibot/user-activity-watcher@development
        with:
          watch:
            optOut:
              - ubiquibot
              - launch-party
              - staging
              - production
  - uses:
      - plugin: ubiquibot/automated-merging@development
        with:
          approvalsRequired:
            collaborator: 1
          mergeTimeout:
            collaborator: "3.5 days"
          repos:
            ignore:
              - ubiquibot
              - launch-party
              - staging
              - production
  - uses:
      - plugin: https://ubiquibot-command-start-stop-development.ubiquity.workers.dev
        with:
          reviewDelayTolerance: "3 Days"
          taskStaleTimeoutDuration: "30 Days"
          startRequiresWallet: true
          maxConcurrentTasks:
            admin: 3
            member: 3
            contributor: 3
  - uses:
      - plugin: ubiquibot/issue-comment-embeddings@development
Differences for /Users/nv/repos/0x4007/sync-configs/src/organizations/ubiquity-os-marketplace/.github/.ubiquibot-config.yml:
--- /Users/nv/repos/0x4007/sync-configs/src/organizations/ubiquity-os-marketplace/.github/.ubiquibot-config.yml	2024-10-01 16:32:06
+++ /Users/nv/repos/0x4007/sync-configs/src/organizations/ubiquity-os-marketplace/.github/.ubiquibot-config.yml.modified	2024-10-01 18:58:32
@@ -117,7 +117,7 @@
         with:
           reviewDelayTolerance: "3 Days"
           taskStaleTimeoutDuration: "30 Days"
-          startRequiresWallet: true # default is true
+          startRequiresWallet: true
           maxConcurrentTasks:
             admin: 3
             member: 3
\ No newline at end of file

✔ Do you want to apply these changes to https://github.com/ubiquity-os-marketplace/ubiquibot-config.git? no
Changes to https://github.com/ubiquity-os-marketplace/ubiquibot-config.git discarded.
undefined
m1:sync-configs nv$
```