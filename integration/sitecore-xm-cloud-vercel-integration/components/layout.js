import Head from 'next/head'

export default function Layout(props) {
  const logoStyle = {
    maxWidth: "15%"
  };
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Example Integration</title>
        <link rel="icon" href="/xmcloud-vercel.ico" />
      </Head>
      <div className="flex-1 flex items-center justify-center">
        {props.children}
      </div>
      <footer className="mt-12 flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
         The XM Cloud Integaration with Vercel Powered by{' '}
          <img src="/xmcloud-vercel.png" alt="XMCloud-Vercel Logo" style={logoStyle} />
        </a>
      </footer>
    </div>
  )
}