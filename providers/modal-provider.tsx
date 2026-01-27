import React from 'react'
import InfoModal from "@/components/modals/info-modal";
import ConfirmModal from "@/components/modals/confirm-modal";
import QrReaderModal from '@/components/modals/qr-reader-modal';

type Props = {}

const ModalProvider = (props: Props) => {
  return (
    <>
        <InfoModal />
        <ConfirmModal />
        <QrReaderModal />
    </>
  )
}

export default ModalProvider