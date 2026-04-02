## System Architecture

![System Architecture Diagram](./docs/architecture.png)

This diagram presents the high-level architecture of the UrbanConnect platform. It illustrates:

- **Edge delivery:** Users access the app via web or mobile, with global routing through a CDN and multi-region static hosting.
- **Application layer:** Stateless, autoscaled Node.js/Express backend with an authentication service (JWT/OAuth). Asynchronous job processing is handled with a message queue.
- **Data layer:** Scalable and reliable MongoDB Atlas (sharded, replicated) and a Redis/Memcached cache (autoscaled) for performance.
- **External services:** Integration with third-party APIs for maps, payments, email, and notifications.
- **Observability:** Centralized logging, monitoring (DataDog/ELK), audit trails, and health checks.
- **Ops & Compliance:** CI/CD automation, autoscaling infrastructure, and backup/disaster recovery, with architectural support for GDPR/SOC2 compliance.

> _For a deep dive into user journeys, scalability, or compliance details, see [/SYSTEM_DESIGN.md](/SYSTEM_DESIGN.md)._