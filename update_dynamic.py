import re

file_path = 'src/app/trip/[tripId]/page.tsx'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace('import Modal from "@/components/modals/Modal";', '')
content = content.replace('import ChecklistModal from "@/components/modals/ChecklistModal";', 'import dynamic from "next/dynamic";\nconst ChecklistModal = dynamic(() => import("@/components/modals/ChecklistModal"));')
content = content.replace('import AddDestinationModal from "@/components/modals/AddDestinationModal";', 'const AddDestinationModal = dynamic(() => import("@/components/modals/AddDestinationModal"));')
content = content.replace('import EditCityModal from "@/components/modals/EditCityModal";', 'const EditCityModal = dynamic(() => import("@/components/modals/EditCityModal"));')
content = content.replace('import ChangeStayModal from "@/components/modals/ChangeStayModal";', 'const ChangeStayModal = dynamic(() => import("@/components/modals/ChangeStayModal"));')
content = content.replace('import ActivityModal from "@/components/modals/ActivityModal";', 'const ActivityModal = dynamic(() => import("@/components/modals/ActivityModal"));')
content = content.replace('import LedgerModal from "@/components/modals/LedgerModal";', 'const LedgerModal = dynamic(() => import("@/components/modals/LedgerModal"));')

with open(file_path, 'w') as f:
    f.write(content)

file_path2 = 'src/app/page.tsx'
with open(file_path2, 'r') as f:
    content = f.read()
content = content.replace('import TripFormModal from "@/components/modals/TripFormModal";', 'import dynamic from "next/dynamic";\nconst TripFormModal = dynamic(() => import("@/components/modals/TripFormModal"));')
with open(file_path2, 'w') as f:
    f.write(content)
