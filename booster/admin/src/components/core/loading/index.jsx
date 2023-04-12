import React from "react";

import './styles.scss'

export const PageLoading = () => (
  <div className="page-loading" id="page-loading-icon">
    <div className="lds-ring">
      <div/>
      <div/>
    </div>
  </div>
)

export const PageLoadingOpacity = () => (
  <div className="page-loading opacity">
    <div className="lds-ring">
      <div/>
      <div/>
    </div>
  </div>
)
