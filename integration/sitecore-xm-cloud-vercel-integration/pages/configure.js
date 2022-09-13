import { useEffect, useState } from 'react'
import GithubLogin from 'components/githublogin'
import Layout from 'components/layout'
import { useRouter } from 'next/router';

// The URL of this page should be added as Configuration URL in your integration settings on Vercel
export default function Configure() {
  const router = useRouter();
  const params = {
    status : ""
  }
  useEffect(() => {
    const { code } = router.query;
    const cloneRepo = async (code) => {      
      const res = await fetch(`/api/cloneRepository?code=${code}`);
      params.status = "logged-in"
    }
    if (router.isReady && code) {
      cloneRepo(code);
    }
  }, [router])

  return (
    <Layout>
      <div className="space-y-2 text-center">
        <h1 className="text-lg font-medium">Let us connect your repo in order to deploy to Sitecore XM Cloud</h1>
        <section className="py-4 flex justify-center">
          <GithubLogin {...params}/>
        </section>
      </div>
    </Layout>
  )
}