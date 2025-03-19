import { User } from "@/types/user";
import { create } from "zustand";

type ContactsStore = {
  contacts: User[];
  totalContacts: number;
  appendContacts: (newContacts: User[]) => void;
  setContacts: (contacts: User[]) => void;
  removeContact: (contactId: number) => void;
  setTotalContacts: (total: number) => void;
};

const useContactsStore = create<ContactsStore>((set) => ({
  contacts: [],
  totalContacts: 0,
  appendContacts: (newContacts: User[]) => 
    set((state) => ({
      contacts: [...state.contacts, ...newContacts]
    })),
  setContacts: (contacts: User[]) => set({ 
    contacts, 
  }),
  removeContact: (contactId: number) =>
    set((state) => ({
      contacts: state.contacts.filter((contact) => contact.id !== contactId),
      totalContacts: state.totalContacts - 1,
    })),
  setTotalContacts: (total: number) => set({
    totalContacts: total,
  }),
}));

export default useContactsStore;
