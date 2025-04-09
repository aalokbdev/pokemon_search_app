export type Pokemon = {
  name: string;
  url: string;
  id: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
};

export type RowData = {
  itemsPerRow: number;
  list: Pokemon[];
};

export type RowProps = {
  index: number;
  style: React.CSSProperties;
  data: RowData;
};

export type pokemon = {
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
};
