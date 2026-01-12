// Test file to verify payload structures
// This file demonstrates the expected payloads for admin and staff case creation

// Expected Admin Payload
const adminPayload = {
  "staffEmail": "staff@firm.com",
  "clientEmail": "client@example.com", 
  "note": "Case notes here",
  "document": "file-url-or-base64",
  "caseTypeId": "case-type-id",
  "lastAdjournedAt": "2024-01-15",
  "nextAdjournedAt": "2024-02-15"
};

// Expected Staff Payload  
const staffPayload = {
  "clientEmail": "client@example.com",
  "note": "Case notes here", 
  "document": "file-url-or-base64",
  "caseTypeId": "case-type-id",
  "lastAdjournedAt": "2024-01-15", 
  "nextAdjournedAt": "2024-02-15"
};

console.log("Admin Payload:", adminPayload);
console.log("Staff Payload:", staffPayload);

// Key differences:
// 1. Admin payload includes "staffEmail" for assignment
// 2. Staff payload does not include "staffEmail" 
// 3. All other fields are the same

export { adminPayload, staffPayload };