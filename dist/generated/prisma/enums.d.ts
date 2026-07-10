export declare const Role: {
    readonly CUSTOMER: "CUSTOMER";
    readonly TECHNICIAN: "TECHNICIAN";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const UserStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
    readonly BANNED: "BANNED";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const BookingStatus: {
    readonly REQUESTED: "REQUESTED";
    readonly ACCEPTED: "ACCEPTED";
    readonly DECLINED: "DECLINED";
    readonly PAID: "PAID";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
export declare const PaymentStatus: {
    readonly PENDING: "PENDING";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
    readonly REFUNDED: "REFUNDED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export declare const ServiceStatus: {
    readonly AVAILABLE: "AVAILABLE";
    readonly UNAVAILABLE: "UNAVAILABLE";
};
export type ServiceStatus = (typeof ServiceStatus)[keyof typeof ServiceStatus];
export declare const PaymentProvider: {
    readonly STRIPE: "STRIPE";
    readonly SSLCOMMERZ: "SSLCOMMERZ";
};
export type PaymentProvider = (typeof PaymentProvider)[keyof typeof PaymentProvider];
//# sourceMappingURL=enums.d.ts.map