import "./globals.css";

export const metadata = {
  title: "Day Compass",
  description: "Answer a few questions, get today's do/don't list.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px" }}>
          {children}
        </div>
      </body>
    </html>
  );
}