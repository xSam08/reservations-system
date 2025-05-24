"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.PaymentStatus = exports.ReportType = exports.NotificationType = exports.ReservationStatus = exports.RoomType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["HOTEL_ADMIN"] = "HOTEL_ADMIN";
    UserRole["SYSTEM_ADMIN"] = "SYSTEM_ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var RoomType;
(function (RoomType) {
    RoomType["SINGLE"] = "SINGLE";
    RoomType["DOUBLE"] = "DOUBLE";
    RoomType["TWIN"] = "TWIN";
    RoomType["SUITE"] = "SUITE";
    RoomType["DELUXE"] = "DELUXE";
})(RoomType || (exports.RoomType = RoomType = {}));
var ReservationStatus;
(function (ReservationStatus) {
    ReservationStatus["PENDING"] = "PENDING";
    ReservationStatus["CONFIRMED"] = "CONFIRMED";
    ReservationStatus["CANCELLED"] = "CANCELLED";
    ReservationStatus["COMPLETED"] = "COMPLETED";
    ReservationStatus["REJECTED"] = "REJECTED";
})(ReservationStatus || (exports.ReservationStatus = ReservationStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["RESERVATION"] = "RESERVATION";
    NotificationType["PAYMENT"] = "PAYMENT";
    NotificationType["REVIEW"] = "REVIEW";
    NotificationType["SYSTEM"] = "SYSTEM";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var ReportType;
(function (ReportType) {
    ReportType["OCCUPANCY"] = "OCCUPANCY";
    ReportType["REVENUE"] = "REVENUE";
    ReportType["CUSTOMER"] = "CUSTOMER";
    ReportType["TREND"] = "TREND";
})(ReportType || (exports.ReportType = ReportType = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentMethod["DEBIT_CARD"] = "DEBIT_CARD";
    PaymentMethod["PAYPAL"] = "PAYPAL";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
//# sourceMappingURL=index.js.map