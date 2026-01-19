http://docs.blnkfinance.com/home/install.md
Complete getting started guide for Blnk. Learn how to install Blnk using Docker, configure your blnk.json file, start the server, and create your first transaction with step-by-step instructions and code examples.

---

http://docs.blnkfinance.com/ledgers/introduction.md
Comprehensive guide to understanding Blnk's ledger system. Explains the difference between General Ledger and custom ledgers, how to create and update ledgers, and provides practical examples of organizing accounts by type or by customer name.

---

http://docs.blnkfinance.com/ledgers/general-ledger.md
Learn about the built-in General Ledger feature in Blnk. Discover how it groups internal balances representing accounts owned by your organization, tracks user transactions in and out of your system, manages organization-to-user transactions like fees and interest, and supports compliance and revenue management.

---

http://docs.blnkfinance.com/ledgers/money-movement-map.md
Guide to designing visual money movement maps that represent how funds flow through your fintech application. Covers key design principles including double-entry and unidirectional flow, provides step-by-step examples for building maps, and explains how maps translate into ledger architecture.

---

http://docs.blnkfinance.com/ledgers/architecture.md
Learn how to design and structure your Blnk ledgers effectively. Explains the folder-file system model, provides examples of organizing ledgers by services versus by users, and helps you decide the best architecture for tracking data important to your application.

---

http://docs.blnkfinance.com/balances/introduction.md
Introduction to ledger balances in Blnk. Explains the six main balance attributes (balance, credit_balance, debit_balance, inflight_balance, and their variants), how to create balances, queued balances tracking, multi-currency support, and understanding negative balances and overdrafts.

---

http://docs.blnkfinance.com/balances/internal-balances.md
Guide to creating and managing internal balances in the General Ledger. Learn how to use the @ prefix naming convention to automatically create organization-owned balances, represent external accounts, and follow best practices for naming conventions when tracking revenue, fees, and other internal accounts.

---

http://docs.blnkfinance.com/balances/balance-monitoring.md
Set up balance monitors to track when balances meet specific thresholds. Configure conditions using operators like greater than, less than, or equal to, monitor credit balance, debit balance, or total balance, and receive instant webhook notifications when conditions are met for fraud detection, compliance, or customer notifications.

---

http://docs.blnkfinance.com/balances/balance-snapshots.md
Learn how to capture daily balance snapshots for historical financial reporting. Understand snapshot frequency (one per day per balance), recommended timing at end-of-day periods, how snapshots enable accurate historical data retrieval, and the relationship between snapshots and transaction reconstruction.

---

http://docs.blnkfinance.com/balances/historical-balances.md
Retrieve balance information at any specific historical timestamp. Learn how Blnk uses balance snapshots and transaction reconstruction to provide accurate historical balances, query balances at past dates for auditing and reporting, and optionally reconstruct balances directly from transactions without using snapshots.

---

http://docs.blnkfinance.com/transactions/introduction.md
Comprehensive guide to transactions in Blnk. Learn about transaction properties including immutability and idempotency, how to record transactions with source and destination balances, verify transaction status using webhooks or API calls, handle insufficient funds, and understand when transactions are discarded due to duplicate references or zero amounts.

---

http://docs.blnkfinance.com/transactions/transaction-lifecycle.md
Understand how transactions move through different states in Blnk's lifecycle. Learn about the five transaction statuses (QUEUED, APPLIED, INFLIGHT, VOID, REJECTED), how parent transactions create transaction lineage, the skip_queue feature for immediate processing, and how each state change creates a new immutable transaction record for complete traceability.

---

http://docs.blnkfinance.com/transactions/parent-transactions.md
Learn how parent transactions work to create clear transaction lineage in Blnk. Understand how queued transactions become parents of applied or inflight transactions, how inflight transactions become parents of committed or voided transactions, how split and bulk transactions use parent relationships, and how to query transactions using the QUEUED_PARENT_TRANSACTION metadata field to trace complete transaction chains.

---

http://docs.blnkfinance.com/transactions/precision.md
Master decimal handling and precision for accurate financial calculations. Learn how Blnk converts decimal amounts to integers using precision values (e.g., USD uses 100 to convert dollars to cents), determine the correct precision value for different asset classes, use the amount field with precision or the precise_amount field for high-precision values, and handle errors when amounts exceed 15 digits or when both fields are provided.

---

http://docs.blnkfinance.com/transactions/overdrafts.md
Enable overdrafts to allow transactions even when source balances are insufficient. Learn how to set allow_overdraft to true, configure overdraft limits to restrict how negative balances can go, understand error handling when limits are exceeded, and explore real-life applications including loans and credit facilities, internal money movement, prepaid cards with buffers, and tiered overdraft limits for different customer segments.

---

http://docs.blnkfinance.com/transactions/inflight.md
Hold transactions until specific conditions are met using Blnk's inflight feature. Learn how inflight transactions maintain separate balance tracking with inflight_balance, inflight_credit_balance, and inflight_debit_balance parameters, commit or void inflight transactions to apply or cancel them, perform partial commits to apply only part of an inflight amount, set expiry dates for automatic voiding, verify inflight status via Search API or webhooks, and use inflight with multiple sources or destinations.

---

http://docs.blnkfinance.com/transactions/refunds.md
Process refunds to reverse previously applied transactions in your Blnk Ledger. Learn how refunds create new transaction records that switch the source and destination of the original transaction, refund single transactions using the transaction_id, bulk refund transactions with multiple sources or destinations using the parent transaction ID, and understand that refunds only work on transactions that have been successfully applied to balances.

---

http://docs.blnkfinance.com/transactions/scheduling.md
Schedule transactions to execute automatically at a future date and time. Learn how to include the scheduled_for field when creating transactions, format dates correctly with timezone information, understand that scheduled transactions start in QUEUED status and automatically apply when the scheduled time is reached, receive webhook notifications when scheduled transactions are applied, and cancel scheduled transactions by creating reverse transactions.

---

http://docs.blnkfinance.com/transactions/multiple-sources.md
Send money from multiple source balances to a single destination in one transaction. Learn how to structure the sources array with identifier and distribution fields, use three distribution types (specific amounts, percentages, or "left" for remaining amounts), understand how Blnk creates separate transaction records for each source linked via parent transactions, retrieve all related transactions using QUEUED_PARENT_TRANSACTION, and use precise_distribution when working with precise_amount for high-precision values.

---

http://docs.blnkfinance.com/transactions/multiple-destinations.md
Send money from a single source balance to multiple destination balances in one transaction. Learn how to structure the destinations array with identifier and distribution fields, use three distribution types (specific amounts, percentages, or "left" for remaining amounts), understand how Blnk creates separate transaction records for each destination linked via parent transactions, retrieve all related transactions using QUEUED_PARENT_TRANSACTION, and use precise_distribution when working with precise_amount for high-precision values.

---

http://docs.blnkfinance.com/transactions/bulk-transactions.md
Process multiple transactions in a single API request using Blnk's bulk transaction feature. Learn how to use atomic processing (all succeed or all fail), independent processing (each handled separately), asynchronous processing for large batches, and inflight bulk transactions. Understand how to retrieve all transactions in a batch, handle webhook notifications, and manage error scenarios including automatic rollbacks for failed atomic transactions.

---

http://docs.blnkfinance.com/transactions/backdated-transactions.md
Record transactions with their original financial date using the effective_date feature, separate from the system creation date. Learn how effective_date differs from created_at, how backdated transactions immediately update current running balances, how historical balance queries use effective_date for accurate point-in-time calculations, and common use cases including late-arriving transactions, month-end reconciliation, financial reporting, audit compliance, error correction, and historical analysis.

---

http://docs.blnkfinance.com/transactions/hash.md
Understand how Blnk uses SHA-256 cryptographic hashing to ensure transaction integrity and immutability. Learn how transaction hashes are generated from transaction details, how to verify transaction integrity by recomputing hashes, the benefits of hashing including immutability and security, and best practices for protecting transaction integrity including external hash logging, audit trails, access controls, and automated integrity checks.

---

http://docs.blnkfinance.com/reconciliations/overview.md
Compare and match your Blnk Ledger with external records like bank statements and payment processor reports to identify and resolve discrepancies. Learn about batch reconciliation for scheduled bulk processing, instant reconciliation for real-time accuracy, how to prepare external data and define matching rules, choosing reconciliation strategies (one-to-one, one-to-many, many-to-one), and common use cases for BNPL platforms, fintech apps, crypto exchanges, payment processors, and multi-currency systems.

---

http://docs.blnkfinance.com/reconciliations/external-data.md
Prepare and format external transaction records from sources like bank statements or payment processors for reconciliation. Learn the required data structure including id, amount, currency, source, description, reference, and date fields, how to export data in CSV or JSON format, upload external data to Blnk using the upload endpoint, and key considerations for consistent formatting, unique references, and UTC timezone conversion.

---

http://docs.blnkfinance.com/reconciliations/matching-rules.md
Define rules that determine how Blnk compares and matches your ledger records with external records. Learn how to create matching rules with criteria for amount, currency, date, reference, and description fields, use operators like equals, contains, greater_than, less_than, after, and before, handle discrepancies with allowable_drift for amounts and dates, understand when to use amount drift for processing fees and date drift for timezone differences, and best practices for efficient and accurate reconciliation.

---

http://docs.blnkfinance.com/reconciliations/strategies.md
Choose reconciliation strategies that define the relationship between external and internal transactions. Learn about one-to-one strategy for straightforward payments where each external transaction matches one internal transaction, one-to-many strategy for split transactions like loan repayments, many-to-one strategy for aggregating transactions like daily sales, how to use grouping_criteria to combine related transactions before matching, and when to apply each strategy based on your financial workflows.

---

http://docs.blnkfinance.com/reconciliations/practice-example.md
Step-by-step tutorial for performing a complete one-to-one reconciliation workflow with Blnk. Learn how to record sample transactions using bulk transactions, prepare and upload external data in CSV format, create matching rules with criteria for amount, currency, and reference, run batch reconciliation with the one_to_one strategy, view reconciliation results including matched and unmatched transaction counts, and handle common errors like authentication failures and bad requests.

---

http://docs.blnkfinance.com/identities/introduction.md
Securely record and manage customer data (individual or organization) within your Blnk Ledger and link identities to balances and transactions for a unified view of financial activities. Learn how to create identities with predefined attributes and custom metadata fields, update and delete identities, understand why identities enable centralized customer management, enhanced security and accountability with tamper-proof audit trails, data-driven customer insights for behavioral patterns, and proactive fraud prevention through identity validation and anomaly detection.

---

http://docs.blnkfinance.com/identities/link-balances.md
Link multiple balances to a single identity within your Blnk Ledger so that any transaction associated with a linked balance is automatically mapped to the corresponding identity. Learn how to create balances connected to identities by including identity_id in the create balance request, update a balance's identity association using the update balance identity endpoint, understand that transactions on linked balances are automatically associated with the identity, and how this enhances data accuracy and traceability across your financial system.

---

http://docs.blnkfinance.com/identities/pii-tokenization.md
Replace sensitive customer data with non-sensitive tokens while maintaining business functionality using PII tokenization. Learn about standard tokenization (random tokens) and format-preserving tokenization (maintains data structure), which identity fields can be tokenized (FirstName, LastName, EmailAddress, PhoneNumber, Street, PostCode), how to tokenize specific fields or multiple fields at once, view which fields are tokenized, detokenize fields to retrieve original values when necessary, and the benefits including enhanced security, simplified compliance (PCI DSS, GDPR), data usability, and granular access control.

---

http://docs.blnkfinance.com/metadata/overview.md
Extend Blnk objects with valuable, context-rich data using metadata to enable informed decision-making and streamlined operations. Learn how metadata can contextualize transactions with timestamps, geo-location, user IDs, and account details, enforce business rules by defining account types and tracking approval status, facilitate reconciliation by linking transactions to external invoices, support scalability by organizing and categorizing large volumes of data, and best practices for consistency, accuracy, granularity, security, performance, documentation, and scalability.

---

http://docs.blnkfinance.com/metadata/create-metadata.md
Add metadata to entities (ledgers, balances, transactions, identities, or balance monitors) by including the meta_data object in JSON payloads when creating or updating items. Learn the basic structure of key-value pairs in meta_data objects, see expanded examples with multiple fields like invoice_id, initiated_by, sender information, and routing details, understand how to retrieve metadata using the Search API or GET endpoints, and see how metadata appears in transaction responses alongside core transaction details.

---

http://docs.blnkfinance.com/metadata/update-metadata.md
Modify existing metadata or add new metadata to ledger components after they have been created using the Update Metadata endpoint. Learn how to add new metadata fields to existing items, update existing metadata values, see step-by-step examples showing how metadata evolves from initial creation through multiple updates, understand that metadata updates are additive and merge with existing metadata, and see the final state of metadata after all updates are applied.

---

http://docs.blnkfinance.com/hooks/overview.md
Trigger actions or receive notifications at specific stages of transactions using Blnk hooks, which execute asynchronously without blocking main transactions. Learn about pre-transaction hooks (PRE_TRANSACTION) that execute before transactions begin for data validation, pre-processing checks, data enrichment, and audit logging, post-transaction hooks (POST_TRANSACTION) that execute after completion for notifications, data synchronization, logging, and settlement processing, and the benefits including extensibility, asynchronous processing, error isolation, flexibility, scalability, and easier system maintenance.

---

http://docs.blnkfinance.com/hooks/create-hooks.md
Register webhooks to receive real-time notifications about transaction events in your Blnk Ledger. Learn how to create pre-transaction and post-transaction hooks with name, URL, type, active status, timeout, and retry_count parameters, update existing hooks, retrieve specific hooks, list hooks by type, delete hooks, understand the hook payload structure for both pre and post-transaction events, and see example payloads showing transaction data sent to your webhook endpoint.

---

http://docs.blnkfinance.com/hooks/examples.md
Explore practical applications of Blnk hooks with real-world examples and use cases. Learn about fraud detection and risk assessment using pre-transaction hooks to trigger external fraud detection systems, customer due diligence and KYC checks for high-value transactions, dynamic transaction enrichment to add metadata before processing, loyalty points and rewards processing after successful transactions, and real-time reconciliation and settlement by sending transaction details to external reconciliation services.

---

http://docs.blnkfinance.com/search/overview.md
Retrieve one or more records from your ledger using Blnk's powerful Search API with filtering, sorting, faceting, and full-text search capabilities across ledgers, balances, transactions, and identities. Learn when to use the Search API versus standard GET endpoints, understand searchable collections and their endpoints, see quick start examples with query parameters, explore common use cases for transaction analysis, account management, and customer support, and understand the response structure including found counts, hits array, pagination, and facet counts.

---

http://docs.blnkfinance.com/search/querying.md
Control what data you search for and which fields to search in using the q and query_by parameters. Learn how to perform exact text searches for specific IDs or values, use wildcard searches with * to return all records, perform multi-word searches across specified fields, search in single or multiple fields using comma separation, search within metadata or nested objects using dot notation, and see common patterns for finding transactions by balance, customers by name or email, and transactions by description keywords.

---

http://docs.blnkfinance.com/search/filtering.md
Refine search results with precise conditions using the filter_by parameter to narrow down large datasets. Learn filter operators including exact match (:=), partial match (:), comparison operators (>, >=, <, <=), range operator ([min..max]), IN operator ([value1, value2]), AND operator (&&), and not equal (:!=), see examples for filtering by transaction status, amount ranges, creation dates, and multiple currencies, and understand how to combine filters with search queries including wildcards.

---

http://docs.blnkfinance.com/search/faceting.md
Get total counts for any field in your search results to build filters and understand data distributions. Learn how faceting helps count transactions per currency, see how many transactions are in each status, group balances by ledger or identity, break transactions into date or amount ranges, combine faceting with filters to analyze specific data subsets, facet on metadata fields using dot notation, and understand the response structure with field_name, value, count, and total_values.

---

http://docs.blnkfinance.com/search/sorting.md
Control the order of search results using the sort_by parameter with ascending or descending directions. Learn basic sorting syntax with field:direction format, sort directions (asc for ascending, desc for descending), multi-field sorting combining up to three fields for hierarchical ordering, common sorting patterns for creation date, amount, and balances, and best practices including defaulting to newest first, combining with filtering, and limiting multi-field sorting complexity.

---

http://docs.blnkfinance.com/search/pagination.md
Navigate through large search result sets efficiently using page and per_page parameters to divide results into manageable chunks. Learn pagination parameters including page (which page to retrieve, default 1) and per_page (number of records per page, max 250, default 10), common pagination patterns for basic navigation, jumping to specific pages, handling large result sets, and combining pagination with sorting, understand the response structure with found, out_of, page, and hits fields, and best practices for page sizes, sorting paginated results, and monitoring performance.

---

http://docs.blnkfinance.com/search/joins.md
Retrieve related data from other collections in a single search query using JOINs to pull balances with identity details, transactions with balance information, and more. Learn how to use include_fields to specify which related collections to return, include all fields with $collection_name(*) or specific fields with $collection_name(field1,field2), filter collections using related data from another collection, merge joined fields into the main document using strategy:merge, handle nested arrays consistently with strategy:nest_array, and perform nested JOINs to go deeper into related data structures.

---

http://docs.blnkfinance.com/guides/double-entry.md
Engineer's guide to understanding the double-entry accounting principle with Blnk. Learn the two fundamental rules that every financial category is represented by an account and every transaction is modeled as a transfer between accounts, understand how double-entry ensures no value is lost (just moved around), see practical examples of recording transactions with source and destination balances, learn how to represent external world transactions using @World internal balance, and understand why double-entry is important for guarding against fraud, enabling settlements, and performing reconciliation.

---

http://docs.blnkfinance.com/guides/negative-balances.md
Understand how negative balances work in Blnk and when they occur. Learn that negative balances indicate a ledger has more debits than credits (balance = credit_balance - debit_balance), see examples showing how negative and positive balances are calculated, understand how to avoid negative balances by designating funding pool balances and applying overdrafts when funding from the funding pool, and see how this approach ensures only the funding pool balance incurs negatives while customer balances remain unaffected.

---

http://docs.blnkfinance.com/guides/currencies.md
Reference guide listing all countries and their corresponding ISO currency codes. View a comprehensive table with flag icons, country names, and currency codes for all countries worldwide, useful for identifying the correct currency code when creating balances or transactions in Blnk, and ensuring proper currency formatting and compliance with international standards.

---

http://docs.blnkfinance.com/guides/currency-exchange.md
Handle multi-currency transactions and currency exchanges in your Blnk Ledger while maintaining complete audit trails. Learn how to record multi-currency transactions by creating two atomically-linked transaction records (one for each currency), use nostro balances (internal balances) to facilitate currency exchanges, ensure atomicity using bulk transactions so both legs succeed or fail together, see practical examples of converting USD to GBP with exchange rates, record FX spread as separate movements for transparency, and understand how this guarantees accurate reconciliation and protects against partial updates.

---

http://docs.blnkfinance.com/guides/concurrency.md
Understand how Blnk handles concurrent transactions through queuing and optimistic locking to ensure accurate and consistent processing. Learn about the queuing system that manages transaction flow through partition-based processing, how transactions are assigned to partitions and processed sequentially within partitions, idempotency through reference value tracking to prevent duplicate processing, optimistic locking that allows concurrent transactions and performs conflict detection at commit time, how version tracking works to detect conflicts, and the rollback and retry process when conflicts are detected.

---

http://docs.blnkfinance.com/guides/hot-balances.md
Strategies for managing high-traffic balances that perform concurrent transactions and preventing lock contention errors. Learn about the problem of lock contention when using skip_queue:true with hot balances, Option 1: use the queue system (recommended) to eliminate lock contention by serializing transactions, Option 2: handle concurrency client-side with sequential processing and retry logic, Option 3: use intermediary balances to reduce load on hot balances by creating customer hold balances that settle to GL balance via queue, and understand the benefits of each approach for different scenarios.

---

http://docs.blnkfinance.com/guides/insufficient-funds.md
Guide for handling insufficient funds scenarios in Blnk versions 0.10.8 and older (for newer versions see updated documentation). Learn about automatic rejection when transactions are attempted with insufficient balance, how Blnk records rejections in the ledger and sends webhook notifications, proactive balance verification by querying balances with queued amounts, calculating available balance as balance - queued_debit_balance, handling insufficient funds for inflight transactions by considering both actual balance and pending inflight amounts, and computing available balance that accounts for inflight and queued debits.

---

http://docs.blnkfinance.com/guides/adjusting-balances.md
Correct errors and omissions in your Blnk Ledger to ensure accurate balance calculations and proper reconciliation. Learn how to identify errors including omissions (transactions in statements but not ledger), timing differences, and amount errors, determine why errors occurred by reviewing your money movement map, adjust affected ledger balances by posting correction transactions (e.g., posting fees to @Fees balance when fees weren't deducted), update your map to prevent future reconciliation errors, and understand the importance of working with accounting or reconciliation officers when identifying errors.

---

http://docs.blnkfinance.com/guides/closing-balances.md
Calculate the net balance of a ledger balance and credit or debit the resulting amount to zero the balance and move it to another ledger balance. Learn that you cannot delete balances once created, only prevent them from participating in more transactions after zeroing, understand how to find the net balance using the balance field (negative needs credit, positive needs debit), see examples showing how to close balances with positive and negative amounts, and understand that closing balances moves funds to another balance rather than deleting the balance record.

---

http://docs.blnkfinance.com/guides/migration.md
Migrate existing financial data from external systems to your Blnk Ledger using backdating and bulk transaction features. Learn about effective_date for recording transactions with original financial dates, bulk transactions API with atomic, independent, asynchronous, and inflight processing options, migration strategies including full historical migration, balance-forward migration, and hybrid approaches, how to prepare historical data by sorting chronologically and formatting for Blnk, execute migrations with bulk backdated transactions, and best practices for phased approaches, balance validation, transaction references, error handling, monitoring progress, and transaction batching strategies.

---

http://docs.blnkfinance.com/advanced/balance-reconstruction.md
Recalculate balances from their transactions to correct discrepancies and ensure balances accurately reflect all recorded activity. Learn how to trigger balance reconstruction by updating metadata with BLNK_RUN_RECONCILIATION flag, verify reconstruction results in the meta_data object showing difference, previous balance values, recalculated balance values, and execution timestamp, understand when to use reconstruction when balances go out of sync, and see how this feature helps solve situations where balances need to be rebuilt from the ground up.

---

http://docs.blnkfinance.com/advanced/notifications.md
Configure real-time webhook notifications for transaction events and system errors in your Blnk Ledger. Learn about the webhook structure with event names and data payloads, supported events for ledgers (ledger.created), balances (balance.created), balance monitors (balance.monitor), transactions (transaction.applied, inflight, void, scheduled, rejected), bulk transactions (bulk_transaction.applied, inflight, failed), identities (identity.created), and system errors (system.error), how to configure notifications in blnk.json with webhook URLs and Slack integration, and understand how to handle error notifications through webhooks and Slack alerts.

---

http://docs.blnkfinance.com/advanced/configuration.md
Customize your Blnk server settings using the blnk.json configuration file or environment variables with BLNK_ prefix. Learn about server configuration (SSL, secure mode, secret keys, domain, email, port), PII tokenization settings, database configuration (connection strings, connection pooling), Redis configuration, Typesense configuration for search functionality, rate limiting settings, transaction configuration (batch size, queue settings, workers, lock duration), reconciliation configuration (default strategies, retries, progress intervals), queue configuration (queue names, workers, monitoring port, webhook concurrency), notification configuration (Slack and webhook URLs), S3 backup configuration, telemetry and observability settings, required fields, automatic defaults, and the configuration loading process.

---

http://docs.blnkfinance.com/advanced/deployment.md
Comprehensive guide to deploying Blnk on cloud infrastructure for operations of all sizes. Learn about Blnk's distributed system architecture with API server, worker, and migration service components, supporting infrastructure including PostgreSQL, Redis, Typesense, and optional Jaeger, single server deployment for development and small-to-medium production, Kubernetes deployment for large-scale production with high availability, step-by-step deployment instructions for both approaches, production considerations for security, monitoring, and backup/recovery, and troubleshooting guides for common deployment issues.

---

http://docs.blnkfinance.com/advanced/enable-https.md
Enable HTTPS encryption for your Blnk server to protect data and ensure privacy and integrity of information exchange. Learn prerequisites including Docker, Compose, and a valid domain name, how to update blnk.json configuration to enable SSL with domain and email settings, ensure your domain DNS points to your server IP address, start your Blnk server to trigger automated SSL certificate issuance and configuration, verify HTTPS setup by accessing your server through browser or curl, and understand next steps for monitoring certificate expiration and following security best practices.

---

http://docs.blnkfinance.com/advanced/secure-blnk.md
Enable secure mode and implement security best practices for your Blnk server environment. Learn how to enable secure mode by setting server.secure to true and providing a strong secret_key, understand authentication methods including master key authentication for full access and fine-grained API keys with specific permissions, learn about scopes that define resource:action permissions (ledgers, balances, transactions, etc.), see examples of creating and using API keys with expiration dates and scopes, understand security best practices for master key management, API key management, configuration management, access control, monitoring and auditing, and regular updates, and learn about error handling for authentication failures.

---

http://docs.blnkfinance.com/advanced/load-testing.md
Perform load testing on your Blnk server using k6 to ensure your deployment can handle expected traffic and maintain performance. Learn about five configurable scenarios including baseline (steady load), ramp (gradually increasing load), contention (hot balance testing), soak (long-duration stability testing), and spike (sudden traffic surge), understand test parameters and environment variables, see how to export and analyze results including performance thresholds, TPM conversion, and troubleshooting common issues like connection errors and high error rates.

---

http://docs.blnkfinance.com/advanced/monitoring-port.md
Configure and use the queue monitoring port to expose internal queue metrics and monitoring endpoints for operational dashboards and health checks. Learn how to configure the monitoring port in blnk.json, access the web dashboard at /monitoring showing queue sizes, tasks processed graphs, queue tables with state and performance metrics, understand features including queue size visualization by status, tasks processed over time, queue table with latency and error rates, and actions for queue management and inspection.

---

http://docs.blnkfinance.com/advanced/backup-disk.md
Back up your Blnk server's PostgreSQL database to local disk storage for data safety and disaster recovery. Learn prerequisites including Docker, Compose, and basic cron knowledge, how to configure the backup directory with proper permissions, update blnk.json with backup_dir path, create backup scripts that trigger the /backup endpoint, automate backups using cron or Task Scheduler, understand best practices for off-site storage, encryption, and retention policies, and learn how to restore databases from backup files using pg_restore.

---

http://docs.blnkfinance.com/advanced/backup-s3.md
Back up your Blnk server to Amazon S3 for secure cloud storage and offsite data protection. Learn prerequisites including Docker, Compose, AWS account with S3 access, how to create IAM users and policies with S3 permissions, configure S3 bucket settings, update blnk.json with AWS credentials (access key ID, secret access key, bucket name, region), create backup scripts for the /backup-s3 endpoint, automate S3 backups with cron scheduling, understand best practices for encryption, versioning, and lifecycle policies, and learn how to restore databases from S3 backups by downloading and using pg_restore.
 
---

http://docs.blnkfinance.com/tutorials/quick-start/wallet-management.md
Step-by-step tutorial for building a complete wallet management system with Blnk. Learn how to create customer wallets, link wallets to customer identities, support deposits and withdrawals, create purpose-specific wallets like card balances, enable transfers between wallets, design a money movement map, and implement the system using the Blnk TypeScript SDK with complete code examples.

---

http://docs.blnkfinance.com/tutorials/quick-start/escrow-payments.md
Tutorial for building an escrow payment workflow using Blnk's inflight transaction feature. Learn how to initiate escrow transactions, verify that all conditions have been met, update transactions based on conditions, handle partial fulfillment cases, design the escrow money movement map, and implement the complete workflow with code examples using the TypeScript SDK.

---

http://docs.blnkfinance.com/tutorials/quick-start/savings-application.md
Tutorial for implementing scheduled savings deposits with the Blnk ledger. Learn how to create customer savings wallet balances, initiate scheduled deposit transactions for recurring savings, update savings frequency, monitor the date of next scheduled deposits, set up new scheduled transactions after current ones complete, and design the money movement map for scheduled savings workflows.

---

http://docs.blnkfinance.com/tutorials/quick-start/loyalty-points.md
Tutorial for building a loyalty points management system using the Blnk Ledger. Learn how to create and manage multi-asset wallets, manage a pool of issued loyalty points, award points to customers when they make purchases, allow customers to redeem points for discounts, design money movement maps for both awarding and redeeming workflows, and implement the complete system with code examples.

---

http://docs.blnkfinance.com/tutorials/digital-banking/deposits-withdrawals.md
Tutorial for implementing deposits and payouts in a banking application using the Blnk Ledger. Learn how to set up your ledger for effective tracking, design flexible workflows for various scenarios, handle deposits from multiple sources with fee tracking, process payouts with fee deductions, ensure reliable and accurate transaction processing, and implement the complete system with practical examples.

---

http://docs.blnkfinance.com/tutorials/digital-banking/cards.md
Tutorial for modeling online card payments using Blnk with authorization and settlement phases. Learn how to create authorization holds using inflight transactions, track pending transactions, settle transactions when processors clear them, void transactions when cancelled, understand the full card payment flow from authorization to settlement, and implement the complete card payment system with code examples.

---

http://docs.blnkfinance.com/tutorials/digital-banking/lending.md
Step-by-step guide to building a simple loan management system using Blnk Finance. Learn how to disburse loans to customers, calculate and apply interest charges, process loan repayments, monitor loan status effectively, design the money movement map for lending workflows, track customer loan wallets and interest revenue, and implement the complete lending system with code examples.

---

http://docs.blnkfinance.com/tutorials/more/ai-billing.md
Tutorial for building an AI billing system with usage-based billing for AI products. Learn how to track token usage from AI providers, calculate costs based on pricing models, manage both prepaid and postpaid billing models, record tokens and dollars atomically in transactions, handle balance management for prepaid and postpaid scenarios, generate invoices from accumulated usage, and implement the complete billing system.

---

http://docs.blnkfinance.com/tutorials/more/order-exchange.md
Guide for implementing a secure and efficient cryptocurrency order exchange system with the Blnk Ledger. Learn how to handle order creation with inflight transactions, manage escrow for multiple cryptocurrencies, match compatible orders together, perform atomic settlements between parties, handle order cancellation and refunds, and implement the complete exchange system with practical examples.

---

http://docs.blnkfinance.com/sdks/overview.md
Overview of Blnk SDKs - open-source libraries for your favorite programming languages. Browse language-specific SDKs including TypeScript and Go, learn about features, installation steps, integration examples to build faster, find links to GitHub repositories, understand community contribution opportunities, and get started with SDK development for your preferred language.

---

http://docs.blnkfinance.com/sdks/typescript/introduction.md
Getting started guide for the Blnk TypeScript SDK. Learn how to install the SDK via npm, initialize the SDK with configuration, set up your Blnk server, connect to local or remote instances, understand SDK structure and available methods, work with ledgers, balances, and transactions, and find links to the open-source TypeScript SDK repository on GitHub.

---

http://docs.blnkfinance.com/sdks/typescript/examples.md
Code examples guide showing real-life fintech use-case implementations with the Blnk TypeScript SDK. Learn how to implement escrow applications, wallet management, savings applications, loyalty points systems, and other common fintech scenarios using the TypeScript SDK with complete working code examples and links to detailed documentation.

---

http://docs.blnkfinance.com/sdks/go/introduction.md
Getting started guide for the Blnk Go SDK. Learn how to install the SDK, initialize the SDK with configuration, set up your Blnk server, connect to local or remote instances, understand SDK structure and available methods, work with ledgers, balances, and transactions using Go, and find links to the open-source Go SDK repository on GitHub.

---

http://docs.blnkfinance.com/sdks/go/examples.md
Code examples guide showing common real-life fintech use-case implementations with the Blnk Go SDK. Learn how to implement escrow applications, wallet management, and other fintech scenarios using the Go SDK with complete working code examples, understand Go-specific patterns and best practices, and find links to detailed documentation for each example.

---

http://docs.blnkfinance.com/blnk-cli/install.md
Installation and setup guide for the Blnk CLI developer tool. Learn how to install the CLI via npm, verify installation, connect to local and remote Blnk instances, connect to secure installations with API tokens, understand CLI capabilities for building, testing, and managing Blnk installations, and get started with command-line operations.

---

http://docs.blnkfinance.com/blnk-cli/ledger/ledgers.md
CLI commands for managing ledgers in your Blnk server. Learn how to create new ledgers interactively, view all ledgers, search ledgers with filtering and pagination options, inspect ledger details, explore account structures, understand output formats, and use the CLI to manage your ledger infrastructure from the command line.

---

http://docs.blnkfinance.com/blnk-cli/ledger/balances.md
CLI commands for querying and managing ledger balances. Learn how to create new balances interactively, view all balances, search balances with filtering options, fetch account balances, filter results by various criteria, export balance data to your system, and use the CLI to manage balance operations efficiently.

---

http://docs.blnkfinance.com/blnk-cli/ledger/transactions.md
CLI commands for managing transactions in your Blnk server. Learn how to create new transactions interactively, retrieve ledger transactions, apply filters to transaction queries, view transaction details, export transaction data for financial workflows, search transactions with various options, and use the CLI for transaction management and analysis.

---

http://docs.blnkfinance.com/blnk-cli/cloud/start.md
Guide for getting started with Blnk Cloud from the CLI. Learn how to log into your Cloud account using email and password, log out from Cloud, understand Cloud features including anomaly detection, collaboration tools, data vault, and data insights, and use cloud commands to manage your ledger through the cloud interface.

---

http://docs.blnkfinance.com/blnk-cli/cloud/upload.md
CLI guide for uploading data to Blnk Cloud Vault. Learn how to upload identity documents securely, validate uploaded documents, extract data from documents, check for duplicate documents, use command options for document type, vision processing, and duplicate checking, understand supported file formats (PDF, DOCX, PNG), and manage document uploads via CLI.

---

http://docs.blnkfinance.com/blnk-cli/cloud/anomalies.md
CLI commands for detecting and examining anomalies in Blnk Cloud. Learn how to view a list of all detected anomalies, use filtering rules to narrow down anomaly results, understand how anomaly detection works for ledgers and balances, respond to irregular events, and use the CLI to monitor and manage anomalies in your financial system.

---

http://docs.blnkfinance.com/reference/create-ledger.md
This creates a new ledger in your Blnk instance. Provide a descriptive name and optional metadata to organize your financial accounts and transactions.

---

http://docs.blnkfinance.com/reference/get-ledger.md
This retrieves details of one or all ledgers in your Blnk instance. Specify a ledger_id to get a specific ledger, or leave empty to view all ledgers.

---

http://docs.blnkfinance.com/reference/update-ledger-name.md
This updates the name of an existing ledger. Provide the ledger_id and the new name to modify the ledger's display name.

---

http://docs.blnkfinance.com/reference/create-balance.md
This creates a new balance in a specified ledger. Provide the ledger_id, currency, optional identity_id for linking, and optional metadata to create account balances.

---

http://docs.blnkfinance.com/reference/get-balance.md
This retrieves details of one or all balances in your Blnk instance. Specify a balance_id to get a specific balance, or leave empty to view all balances. Optionally include queued balances in the response.

---

http://docs.blnkfinance.com/reference/get-balance-by-indicator.md
This retrieves a balance by its indicator value instead of balance_id. Available in version 0.10.3 and later, useful for finding balances using custom indicator identifiers.

---

http://docs.blnkfinance.com/reference/update-balance-identity.md
This updates the identity associated with an existing balance. Provide the balance_id and the new identity_id to link or change the identity connection.

---

http://docs.blnkfinance.com/reference/balances-snapshots.md
This captures a snapshot of a balance at a specific point in time. Useful for historical balance tracking and financial reporting at period end dates.

---

http://docs.blnkfinance.com/reference/historical-balances.md
This retrieves the historical balance of an account at a specific timestamp. Provide the balance_id and timestamp to get the balance value at that point in time, calculated from snapshots and intervening transactions.

---

http://docs.blnkfinance.com/reference/create-balance-monitor.md
This creates a balance monitor to track a balance against specific conditions. Provide the balance_id, threshold conditions, and notification settings to monitor balance changes and get alerts.

---

http://docs.blnkfinance.com/reference/get-balance-monitor.md
This retrieves details of one or all balance monitors in your Blnk instance. Specify a monitor_id to get a specific monitor, or leave empty to view all monitors.

---

http://docs.blnkfinance.com/reference/edit-balance-monitor.md
This updates an existing balance monitor's configuration. Provide the monitor_id and new settings to modify threshold conditions, notification preferences, or other monitor parameters.

---

http://docs.blnkfinance.com/reference/create-transaction.md
This records a new transaction in your Blnk Ledger. Provide source and destination balances, amount, currency, reference, and optional fields like description, scheduled_for, allow_overdraft, and inflight to create financial transactions.

---

http://docs.blnkfinance.com/reference/get-transaction.md
This retrieves details of a specific transaction by its transaction_id. Returns complete transaction information including status, amounts, source, destination, and metadata.

---

http://docs.blnkfinance.com/reference/get-transaction-by-reference.md
This retrieves a transaction by its unique reference number instead of transaction_id. Useful for finding transactions using your own reference identifiers for idempotency.

---

http://docs.blnkfinance.com/reference/update-inflight.md
This commits or voids an inflight transaction. Provide the transaction_id and status (commit or void) to finalize a held transaction, with optional partial commit amount support.

---

http://docs.blnkfinance.com/reference/refund-transaction.md
This creates a refund transaction that reverses a previous transaction. Provide the original transaction_id to automatically create a refund that moves funds back from destination to source.

---

http://docs.blnkfinance.com/reference/multiple-sources.md
This creates a transaction that aggregates amounts from multiple source balances. Provide an array of source balances with distribution amounts to combine funds from multiple accounts into a single destination.

---

http://docs.blnkfinance.com/reference/multiple-destinations.md
This creates a transaction that splits an amount across multiple destination balances. Provide an array of destination balances with distribution amounts or percentages to divide funds among multiple recipients.

---

http://docs.blnkfinance.com/reference/bulk-transactions.md
This processes multiple transactions in a single API request. Configure atomic processing (all succeed or all fail), independent processing, asynchronous processing, and inflight options to handle batch transaction operations efficiently.

---

http://docs.blnkfinance.com/reference/start-reconciliation.md
This starts a batch reconciliation process to match your ledger with external records. Provide the upload_id of uploaded external data, matching rule IDs, reconciliation strategy, and optional grouping criteria to begin reconciliation.

---

http://docs.blnkfinance.com/reference/instant-reconciliation.md
This performs instant reconciliation by providing external transactions directly in the request. Provide an array of external transactions with matching rule IDs and strategy to reconcile in real-time without file uploads.

---

http://docs.blnkfinance.com/reference/get-reconciliations.md
This retrieves details of one or all reconciliation processes in your Blnk instance. Specify a reconciliation_id to get a specific reconciliation, or leave empty to view all reconciliations with their status and results.

---

http://docs.blnkfinance.com/reference/upload-data.md
This uploads external data files (CSV or JSON) containing transaction records for reconciliation. Upload files with proper formatting to prepare external data for batch reconciliation processes.

---

http://docs.blnkfinance.com/reference/create-matching-rules.md
This creates a matching rule that defines how ledger records are compared with external records during reconciliation. Provide criteria for amount, currency, date, reference, and description matching with operators and allowable drift settings.

---

http://docs.blnkfinance.com/reference/create-identity.md
This creates a new identity (individual or organization) in your Blnk Ledger. Provide identity type, personal or organizational details, contact information, address, and optional metadata to store customer data.

---

http://docs.blnkfinance.com/reference/get-identity.md
This retrieves details of one or all identities in your Blnk instance. Specify an identity_id to get a specific identity, or leave empty to view all identities with their complete information.

---

http://docs.blnkfinance.com/reference/edit-identity.md
This updates an existing identity's information. Provide the identity_id and updated fields to modify personal details, contact information, address, or metadata for customer records.

---

http://docs.blnkfinance.com/reference/tokenize-field.md
This tokenizes a specific field in an identity to replace sensitive data with secure tokens. Provide the identity_id and field name to protect PII while maintaining functionality.

---

http://docs.blnkfinance.com/reference/tokenize-identity.md
This tokenizes multiple fields in an identity at once. Provide the identity_id and array of field names to secure multiple PII fields simultaneously.

---

http://docs.blnkfinance.com/reference/get-tokenized-fields.md
This retrieves a list of fields that are currently tokenized for an identity. Provide the identity_id to see which PII fields have been secured with tokenization.

---

http://docs.blnkfinance.com/reference/detokenize-field.md
This retrieves the original value of a tokenized field. Provide the identity_id and field name to access the original PII data when needed for authorized operations.

---

http://docs.blnkfinance.com/reference/detokenize-identity.md
This retrieves the original values of multiple tokenized fields. Provide the identity_id and array of field names to access original PII data for multiple fields at once.

---

http://docs.blnkfinance.com/reference/update-metadata.md
This modifies or adds new metadata to a ledger component (ledger, balance, transaction, identity, or balance monitor). Provide the component ID and metadata object to update custom attributes.

---

http://docs.blnkfinance.com/reference/create-hooks.md
This registers a new webhook hook in Blnk. Provide name, URL, type (PRE_TRANSACTION or POST_TRANSACTION), active status, timeout, and retry_count to set up event notifications.

---

http://docs.blnkfinance.com/reference/update-hooks.md
This updates an existing hook's configuration. Provide the hook_id and new settings to modify URL, active status, timeout, retry_count, or other hook parameters.

---

http://docs.blnkfinance.com/reference/view-hooks.md
This retrieves details of a specific hook by its hook_id. Returns complete hook information including configuration, status, and settings.

---

http://docs.blnkfinance.com/reference/list-hooks-by-type.md
This retrieves all hooks filtered by type (PRE_TRANSACTION or POST_TRANSACTION). Useful for viewing all hooks of a specific type in your system.

---

http://docs.blnkfinance.com/reference/delete-hooks.md
This deletes a hook from your Blnk instance. Provide the hook_id to remove the webhook registration and stop receiving events from that hook.

---

http://docs.blnkfinance.com/reference/search.md
This performs advanced search queries across ledgers, balances, transactions, and identities. Available in version 0.6.1 and later, provides filtering, sorting, faceting, and full-text search capabilities with more control than standard GET endpoints.

---

http://docs.blnkfinance.com/reference/create-api-key.md
This creates a new API key with fine-grained permissions (scopes) for access control. Available in version 0.10.1 and later, requires master key authentication, allows you to grant specific resource:action permissions instead of using the master key for all operations.

---

http://docs.blnkfinance.com/reference/get-api-key.md
This lists all API keys for a specific owner. The owner query parameter is required to retrieve API keys. Use this endpoint to audit and manage your API keys. Note that the actual API key value is not returned for security reasons (hashed in v0.12.0+).

---

http://docs.blnkfinance.com/reference/delete-api-key.md
This revokes an API key by deleting it from your system. Provide the API key ID to remove access and maintain good security hygiene by revoking unused or expired keys.

---

http://docs.blnkfinance.com/reference/get-health.md
This checks the health status of the Blnk API server. Available in version 0.10.3 and later, public access (no authentication required) in v0.10.4, typically used for readiness and liveness checks in deployment environments like Docker, Kubernetes, or load balancers.

---

http://docs.blnkfinance.com/changelog/blnk-core.md
Changelog tracking all releases, fixes, enhancements, and version history for Blnk Core. Explore latest features, improvements, bug fixes, breaking changes, and updates to the core platform with detailed release notes and migration guides.

---

http://docs.blnkfinance.com/changelog/blnk-cli.md
Changelog tracking all updates, fixes, new commands, and version history of the Blnk command-line tool. Browse CLI improvements, new features, bug fixes, and updates to help you stay current with CLI capabilities.

---

http://docs.blnkfinance.com/changelog/v12-migration.md
Migration guide for upgrading to Blnk v0.12.0, covering breaking changes related to API key security enhancements. Learn about SHA-256 hashing implementation for API keys, how it affects storage and retrieval, why existing keys will fail after upgrade, and steps to recreate API keys after migration.

---

http://docs.blnkfinance.com/changelog/v11-migration.md
Migration guide for upgrading from Blnk v0.10.x to v0.11.0, covering breaking changes related to Typesense/Search functionality. Learn about upgrading Typesense server from 0.23.x to 0.24.x, required Docker configuration updates, API compatibility changes, schema handling updates, and migration steps for production and development environments.