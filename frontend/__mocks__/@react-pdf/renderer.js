module.exports = {
  PDFDownloadLink: ({ children }) => children,
  Document: ({ children }) => <div>{children}</div>,
  Page: ({ children }) => <div>{children}</div>,
  Text: ({ children }) => <span>{children}</span>,
  View: ({ children }) => <div>{children}</div>,
  Image: () => <div />,
};
