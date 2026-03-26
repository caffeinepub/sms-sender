import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import OutCall "http-outcalls/outcall";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  type SmsRecord = {
    id : Nat;
    phone : Text;
    message : Text;
    timestamp : Int;
    status : Text;
  };

  type SmsResponse = {
    success : Bool;
    message : Text;
  };

  module SmsRecord {
    public func compareByTimestamp(record1 : SmsRecord, record2 : SmsRecord) : Order.Order {
      Int.compare(record1.timestamp, record2.timestamp);
    };
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // State
  let userSmsHistory = Map.empty<Principal, [SmsRecord]>();
  var nextSmsId = 0;

  // SMS Logic
  func addSmsRecord(caller : Principal, phone : Text, message : Text, status : Text) {
    let smsRecord : SmsRecord = {
      id = nextSmsId;
      phone;
      message;
      timestamp = Time.now();
      status;
    };

    nextSmsId += 1;

    let existingHistory = switch (userSmsHistory.get(caller)) {
      case (null) { [] };
      case (?history) { history };
    };

    userSmsHistory.add(caller, existingHistory.concat([smsRecord]));
  };

  // Outcall logic
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func sendSms(phone : Text, message : Text) : async SmsResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send SMS messages");
    };

    let requestBody = "{ \"phone\": \"" # phone # "\", \"message\": \"" # message # "\", \"key\": \"textbelt\" }";

    let outcallResult = await OutCall.httpPostRequest(
      "https://textbelt.com/text",
      [{ name = "Content-Type"; value = "application/json" }],
      requestBody,
      transform,
    );

    let (status, responseMessage) = if (outcallResult.contains(#text "true")) {
      ("success", "SMS sent successfully");
    } else {
      ("error", "SMS sending failed. Please try again later.");
    };

    addSmsRecord(caller, phone, message, status);

    {
      success = status == "success";
      message = responseMessage;
    };
  };

  public query ({ caller }) func getSmsHistory() : async [SmsRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view SMS history");
    };

    switch (userSmsHistory.get(caller)) {
      case (null) { [] };
      case (?history) { history.sort(SmsRecord.compareByTimestamp) };
    };
  };
};
