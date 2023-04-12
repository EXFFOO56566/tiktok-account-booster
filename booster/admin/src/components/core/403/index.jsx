import React from 'react'
import css from 'styled-jsx/css'
import UIButton from '../button'

const styles = css.global`
  .page-403 {
    padding: 40px;
    background: #fff!important;
  }
`

const Page403 = () => (
  <div className="page-403 w-1/3 h-1/2 m-auto text-center py-32 rounded mt-16">
      <h1 className="text-3xl primary-color">403</h1>
      <h2 className="text-xl second-color">Access denied</h2>
      <UIButton className="gray mt-10" onClick={() => window.location.href = "/"}>Home page</UIButton>
    <style jsx>{styles}</style>
  </div>
)

export default Page403