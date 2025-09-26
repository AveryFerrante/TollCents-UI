class LocalStorageService<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  get(): T | null {
    const item = localStorage.getItem(this.key);
    return item ? (JSON.parse(item) as T) : null;
  }

  set(value: T): void {
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}

export const accessCodeStorage = new LocalStorageService<string>("accessCode");

interface PreviousSearchedAddresses {
  startAddresses: SearchedAddress[];
  endAddresses: SearchedAddress[];
}

interface SearchedAddress {
  address: string;
  count: number;
}

export const PreviousSearchedAddressesStorage =
  new LocalStorageService<PreviousSearchedAddresses>(
    "previousSearchedAddresses"
  );
