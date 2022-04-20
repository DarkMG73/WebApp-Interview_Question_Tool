import React, { useState, useEffect } from "react";
import db from "../storage/firebase.config";

export function addItem(progName, theDataObject, id, refresh) {
  const data = db.collection(progName);

  data
    .doc(id)
    .set(theDataObject)
    .finally(function () {
      const msg = "Everything submitted successfully!";
      alert(msg);
      if (refresh) {
        window.location.href = window.location.href;
      }
    });
}

// export function updateItem(editedItems, altId, refresh) {
//   let itemId;
//   if (altId) {
//     itemId = altId;
//   } else {
//     itemId = editedItems.id;
//   }

//   allQuestions[itemId] = editedItems;

//   const data = db.collection(progName).doc(itemId);

//   let cntr = 0;
//   var size = Object.keys(editedItems).length;
//   return data
//     .update(editedItems)
//     .then(function () {
//       cntr++;
//       alert("Document successfully updated!");
//     })
//     .catch(function (error) {
//       // The document probably doesn't exist.
//       console.error("Error updating document: ", error);
//       alert("Error updating document: ");
//     })
//     .finally(function () {
//       if (refresh) {
//         // sendAndReload(refresh);
//       } else {
//         //  sendAndReload();
//       }
//     });
// }

// export function deleteItem(progName, idToDelete, theElm, refresh) {
//   const toConfirm = confirm(
//     "Are you positve that yopu want to permanantly REMOVE this item?"
//   );
//   if (toConfirm) {
//     db.collection(progName)
//       .doc(idToDelete)
//       .delete()
//       .then(function () {
//         theElm.innerHTML =
//           '<div class="deleted-text" ><p><b>Item deleted.</b><p>';

//         console.log("Document successfully deleted!");
//       })
//       .catch(function (error) {
//         console.error("Error removing document: ", error);
//       });

//     // 	sendAndReload();
//   }
// }
