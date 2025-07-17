import { useRouter } from 'next/router';
export default {
  logo: <span>Ved Docs</span>,
  project: {
    link: 'https://github.com/ved-analytics',
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Ved Docs" />
      <meta property="og:description" content="Documentation for Ved Analytics" />
      <script
        defer
        src="https://scripts.vedanalytics.in/bundle.js"
        data-project="9f1ee1c9-84b4-4f7a-9c36-5b24292e5887"
        data-api-key="Ll0whwlhJBGndWlUHfVx6D+p2EfymzqoRTw/R4C2nS4P7f4KUNs16KXpHk3zMZ30UqUrzBjlRzc3QVG+szKARPjCWjk5261PihrgwS/JwrdpOj/EFy/I5YohhmdfcZ8xZJKtAvF23P/vMVxotJNVsXCEundQDczEHjVpo2rcLAU="
      ></script>
    </>
  ),
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Ved',
      };
    }
  },
};
