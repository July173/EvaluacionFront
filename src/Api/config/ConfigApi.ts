

// Normalize the API base URL. Developers should set VITE_API_BASE_URL in
// the project root (e.g. .env) to a full URL like: http://localhost:8000/api/
const rawBase = String(import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5147/api/").trim();

// Remove obvious leading dots that break hostnames (e.g. ".127.0.0.1")
let API_BASE_URL = rawBase.replace(/^\.+/, "");

// If the value doesn't include a scheme, prepend http:// so fetch calls have a protocol.
if (!/^https?:\/\//i.test(API_BASE_URL)) {
  API_BASE_URL = `http://${API_BASE_URL}`;
}

// Ensure trailing slash for consistent concat behavior below
if (!API_BASE_URL.endsWith("/")) API_BASE_URL += "/";


export const ENDPOINTS = {
  Auth: {
    register: `${API_BASE_URL}Auth/register`,
    login: `${API_BASE_URL}Auth/login`,
    refreshToken: `${API_BASE_URL}Auth/refresh`,
    revokeToken: `${API_BASE_URL}Auth/revoke`,
  },
  Parent: {
    createParent: `${API_BASE_URL}Parent/`,
    getAllParents: `${API_BASE_URL}Parent/`,
    getParentById: `${API_BASE_URL}Parent/{id}/`,
    updateParent: `${API_BASE_URL}Parent/{id}/`,
  deleteParent: `${API_BASE_URL}Parent/{id}/deleteLogical/`,

  },
  AdoptionDetail: {
    createAdoptionDetail: `${API_BASE_URL}AdoptionDetail/`,
    getAllAdoptionDetails: `${API_BASE_URL}AdoptionDetail/`,
    getAdoptionDetailById: `${API_BASE_URL}AdoptionDetail/{id}/`,
    updateAdoptionDetail: `${API_BASE_URL}AdoptionDetail/{id}/`,
  deleteAdoptionDetail: `${API_BASE_URL}AdoptionDetail/{id}/deleteLogical/`,
  },
  Child: {
    createChild: `${API_BASE_URL}Child/`,
    getAllChildren: `${API_BASE_URL}Child/`,
    getChildById: `${API_BASE_URL}Child/{id}/`,
    updateChild: `${API_BASE_URL}Child/{id}/`,
  deleteChild: `${API_BASE_URL}Child/{id}/deleteLogical/`,


  },
  ChildOrphanage: {
    createChildOrphanage: `${API_BASE_URL}ChildOrphanage/`,
    getAllChildren: `${API_BASE_URL}ChildOrphanage/`,
    getChildById: `${API_BASE_URL}ChildOrphanage/{id}/`,
    updateChild: `${API_BASE_URL}ChildOrphanage/{id}/`,
    deleteChild: `${API_BASE_URL}ChildOrphanage/{id}/deleteLogical/`,

  },
  Orphanage: {
    createOrphanage: `${API_BASE_URL}Orphanage/`,
    getAllOrphanages: `${API_BASE_URL}Orphanage/`,
    getOrphanageById: `${API_BASE_URL}Orphanage/{id}/`,
    updateOrphanage: `${API_BASE_URL}Orphanage/{id}/`,
  deleteOrphanage: `${API_BASE_URL}Orphanage/{id}/deleteLogical/`,

  },
  SocialWorker: {
    createSocialWorker: `${API_BASE_URL}SocialWorker/`,
    getAllSocialWorkers: `${API_BASE_URL}SocialWorker/`,
    getSocialWorkerById: `${API_BASE_URL}SocialWorker/{id}/`,
    updateSocialWorker: `${API_BASE_URL}SocialWorker/{id}/`,
  deleteSocialWorker: `${API_BASE_URL}SocialWorker/{id}/deleteLogical/`,

  },
  Adoption: {
    createAdoption: `${API_BASE_URL}Adoption/`,
    getAllAdoptions: `${API_BASE_URL}Adoption/`,
    getAdoptionById: `${API_BASE_URL}Adoption/{id}/`,
    updateAdoption: `${API_BASE_URL}Adoption/{id}/`,
  deleteAdoption: `${API_BASE_URL}Adoption/{id}/deleteLogical/`,
  },
  
  /** Endpoints for dynamic menu by role */
  menu: {
    getMenuItems: `${API_BASE_URL}RolFormPermission/menu/{userId}`,
  },

};


/**
 * Exports the base API URL for external use.
 */
export default API_BASE_URL;