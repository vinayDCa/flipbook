import { get, set } from 'idb-keyval';

export const previewStore = {
  catalogue: null as any | null,
  
  async save(catalogue: any) {
    this.catalogue = catalogue;
    await set('preview_catalogue', catalogue);
  },
  
  async load() {
    if (!this.catalogue) {
      this.catalogue = await get('preview_catalogue');
    }
    return this.catalogue;
  }
};
