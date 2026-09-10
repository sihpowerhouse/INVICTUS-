import {
  Shield,
  Microscope,
  Wifi,
  Scale,
  Landmark,
  Archive,
  UserCog,
  FileText,
  Users,
  Camera,
  Search,
  FlaskConical,
  MonitorSmartphone,
  Globe,
  ScrollText,
  Gavel,
  BookOpen,
  FolderOpen,
  Layers,
  ScanSearch,
  KeyRound,
  ShieldCheck,
  BarChart3,
  ClipboardList,
} from 'lucide-react';
import type { Department } from '../types/department';

/**
 * Mock department data.
 *
 * Each department represents a workspace concept in the INVICTUS platform.
 * This data will eventually come from a backend endpoint.
 */
export const departments: Department[] = [
  {
    id: 'POLICE',
    title: 'Police',
    description: 'Investigations, FIR management, witnesses & interrogations',
    icon: Shield,
    status: 'OPERATIONAL',
    activeWorkload: 24,
    actions: [
      { label: 'Investigations', icon: Search },
      { label: 'FIR Registry', icon: FileText },
      { label: 'Witnesses', icon: Users },
      { label: 'Interrogations', icon: Camera },
    ],
  },
  {
    id: 'FSL',
    title: 'Forensic Science',
    description: 'Evidence intake, lab examination & forensic reporting',
    icon: Microscope,
    status: 'OPERATIONAL',
    activeWorkload: 18,
    actions: [
      { label: 'Evidence Intake', icon: ClipboardList },
      { label: 'Lab Examination', icon: FlaskConical },
      { label: 'Forensic Reports', icon: FileText },
      { label: 'Verification', icon: ShieldCheck },
    ],
  },
  {
    id: 'CYBER',
    title: 'Cyber Crime',
    description: 'Digital evidence, device records & network intelligence',
    icon: Wifi,
    status: 'ELEVATED',
    activeWorkload: 11,
    actions: [
      { label: 'Digital Evidence', icon: MonitorSmartphone },
      { label: 'Device Records', icon: FolderOpen },
      { label: 'Network Intel', icon: Globe },
      { label: 'Technical Reports', icon: FileText },
    ],
  },
  {
    id: 'PROSECUTION',
    title: 'Prosecution',
    description: 'Charge sheets, evidence review & court submissions',
    icon: Scale,
    status: 'OPERATIONAL',
    activeWorkload: 9,
    actions: [
      { label: 'Charge Sheets', icon: ScrollText },
      { label: 'Evidence Review', icon: ScanSearch },
      { label: 'Legal Documents', icon: FileText },
      { label: 'Court Submission', icon: Gavel },
    ],
  },
  {
    id: 'JUDICIARY',
    title: 'Judiciary',
    description: 'Court filings, judgments & case history',
    icon: Landmark,
    status: 'OPERATIONAL',
    activeWorkload: 15,
    actions: [
      { label: 'Court Filings', icon: FileText },
      { label: 'Evidence Review', icon: ScanSearch },
      { label: 'Judgments', icon: Gavel },
      { label: 'Case History', icon: BookOpen },
    ],
  },
  {
    id: 'RECORDS',
    title: 'Records',
    description: 'Document registry, metadata, versions & archiving',
    icon: Archive,
    status: 'OPERATIONAL',
    activeWorkload: 37,
    actions: [
      { label: 'Document Registry', icon: FolderOpen },
      { label: 'Metadata', icon: Layers },
      { label: 'OCR Review', icon: ScanSearch },
      { label: 'Archiving', icon: Archive },
    ],
  },
  {
    id: 'ADMIN',
    title: 'Administration',
    description: 'Users, roles, permissions, audit & analytics',
    icon: UserCog,
    status: 'OPERATIONAL',
    activeWorkload: 5,
    actions: [
      { label: 'Users', icon: Users },
      { label: 'Permissions', icon: KeyRound },
      { label: 'Audit', icon: ShieldCheck },
      { label: 'Analytics', icon: BarChart3 },
    ],
  },
];
