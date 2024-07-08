export type Message = {
  id: string;
  role: string;
  content: [
    {
      text: {
        annotations: [];
        value: string;
      };
    }
  ];
};
