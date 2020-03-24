## Blockchain-based_Medical_Record_Management_Testing_Framework_Caliper

Welcome to the Blockchain-based_Medical_Record_Management_Testing_Framework_Caliper project. Caliper is a blockchain performance benchmark framework, which allows users to test different blockchain solutions with predefined use cases, and get a set of performance test results. This is used to test performance indicators of [Blockchain-based Medical Records Management System](https://github.com/KoushikAS/Blockchain-based_Medical_Records_Management_System).

Currently performance indicators tested are:
* Success rate
* Transaction/Read throughput
* Transaction/Read latency(minimum, maximum, average, percentile)
* Resource consumption (CPU, Memory, Network IO,...)


## License
The Caliper codebase is release under the [Apache 2.0 license](./LICENSE). Any documentation developed by the Caliper Project is licensed under the Creative Commons Attribution 4.0 International License. You may obtain a copy of the license, titled CC-BY-4.0, at http://creativecommons.org/licenses/by/4.0/.


To Run it :
npm run bench -- -c benchmark/composer/config.yaml -n network/fabric-v1.2/2org1peercouchdb/composer.json 
