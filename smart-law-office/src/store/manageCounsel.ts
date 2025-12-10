// import {create} from 'zustand'

// export interface Counsel {
//   id: number;
//   fullName: string;
//   scn: string;
//   callToBarFile: string | null;
// }

// export inferface ManageCounselData{
//   // Step 3: Counsel
//   // counsel: Counsel[];

//   // Step 4: Office Link
//   // officeLink: string;
// }

// interface ManageCounselStore{
//   // addCounsel: () => void;
//   // removeCounsel: (id: number) => void;
//   // updateCounsel: (id: number, key: keyof Counsel, value: any) => void;
//   // generateOfficeLink: () => void;
// }

// const initalFormData: ManageCounselData= {
//   // counsel: [
//   //   {
//   //     id: 1,
//   //     fullName: "",
//   //     scn: "",
//   //     callToBarFile: null
//   //   }
//   // ],
//   // officeLink: "",
// }

// export const useManageCounselStore = create<ManageCounselStore>({

//   // addCounsel: () => {
//       //   const state = get();
//       //   get().updateActivity();
//       //   const maxId = Math.max(...state.formData.counsel.map((c) => c.id), 0);
//       //   const newCounsel: Counsel = {
//       //     id: maxId + 1,
//       //     fullName: "",
//       //     scn: "",
//       //     callToBarFile: ""
//       //   };
//       //   set({
//       //     formData: {
//       //       ...state.formData,
//       //       counsel: [...state.formData.counsel, newCounsel]
//       //     }
//       //   });
//       // },

//       // removeCounsel: (id) => {
//       //   get().updateActivity();
//       //   set((state) => ({
//       //     formData: {
//       //       ...state.formData,
//       //       counsel: state.formData.counsel.filter((c) => c.id !== id)
//       //     }
//       //   }));
//       // },

//       // updateCounsel: (id, key, value) => {
//       //   get().updateActivity();
//       //   set((state) => ({
//       //     formData: {
//       //       ...state.formData,
//       //       counsel: state.formData.counsel.map((c) =>
//       //         c.id === id ? { ...c, [key]: value } : c
//       //       )
//       //     }
//       //   }));
//       // },

//       // generateOfficeLink: () => {
//       //   get().updateActivity();
//       //   set((state) => {
//       //     // use firmName when ready
//       //     const firmNameSlug = state.formData.firmName
//       //       .toLowerCase()
//       //       .replace(/[^a-z0-9]+/g, "-")
//       //       .replace(/(^-|-$)/g, "");
//       //     const officeLink = `https://cyntlawoffice.com/${firmNameSlug}`;
//       //     return {
//       //       formData: { ...state.formData, officeLink }
//       //     };
//       //   });
//       // },

//   //append counsel data
//           // formData.counsel.forEach((counsel, index) => {
//           //   completeSignupPayload.append(
//           //     `counsel[${index}][id]`,
//           //     String(counsel.id)
//           //   );
//           //   completeSignupPayload.append(
//           //     `counsel[${index}][fullName]`,
//           //     counsel.fullName
//           //   );
//           //   completeSignupPayload.append(`counsel[${index}][scn]`, counsel.scn);

//           //   if (counsel.callToBarFile) {
//           //     completeSignupPayload.append(
//           //       `counsel[${index}][callToBarFile]`,
//           //       counsel.callToBarFile
//           //     );
//           //   }
//           // });
// })
