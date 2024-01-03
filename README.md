# Blockchain-based Medical Record Management Testing Framework Caliper

Welcome to the Blockchain-based Medical Record Management Testing Framework Caliper project. Caliper is a blockchain performance benchmark framework that enables users to test different blockchain solutions with predefined use cases and obtain a set of performance test results. This framework is specifically used to assess performance indicators of the Blockchain-based Medical Records Management System.

## Performance Indicators

Currently, the following performance indicators are tested:

- **Success Rate**: Measures the rate of successful transactions or operations.
- **Transaction/Read Throughput**: Evaluates the number of transactions or read operations processed per unit of time.
- **Transaction/Read Latency**: Includes measurements of minimum, maximum, average, and percentile latencies for transactions or read operations.
- **Resource Consumption**: Assesses the usage of system resources such as CPU, Memory, Network I/O, etc.

## Getting Started

### Prerequisites

- Node.js and npm installed.
- Access to the Caliper repository and related blockchain platform configurations.

### Running the Test

To run the performance benchmark, use the following command:

```bash
npm run bench -- -c benchmark/composer/config.yaml -n network/fabric-v1.2/2org1peercouchdb/composer.json
```

## Contributions

This project was developed as part of an academic final year project. Contributions were made solely by Koushik Annareddy Sreenath, Bhavya Jain, Nikita Menon, and Divyansh Lohia, adhering to the project guidelines and requirements set by Ramaiah Institute of Technology.

## License

- The Caliper codebase is released under the Apache 2.0 license.
- Any documentation developed by the Caliper Project is licensed under the Creative Commons Attribution 4.0 International License.
- You may obtain a copy of the license, titled CC-BY-4.0, at [http://creativecommons.org/licenses/by/4.0/](http://creativecommons.org/licenses/by/4.0/).

## Acknowledgments

Gratitude to Shilpa Chaudhari, Vijaya Kumar B.P and the course staff for their invaluable guidance.

