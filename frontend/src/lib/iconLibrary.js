import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ShieldCheck, Shield, ShieldAlert, Lock, Unlock, KeyRound, Fingerprint, Eye, ScanSearch, Bug,
  Cloud, CloudUpload, Server, ServerCog, Database, HardDrive, Archive, Cpu, Monitor, MonitorCheck, Laptop, Smartphone, Tablet, Printer,
  Wifi, Network, Router, Globe, Workflow, Layers, Puzzle, Infinity as InfinityIcon,
  Mail, Phone, MessageSquare, Headphones, LifeBuoy, Bell,
  Users, User, UserCheck, Handshake, Building2, Briefcase, Factory, HardHat, Truck, Package, Box,
  HeartPulse, Stethoscope, Scale, Landmark, GraduationCap,
  BarChart3, LineChart, PieChart, TrendingUp, Activity, Gauge, DollarSign,
  FileText, FolderOpen, ClipboardCheck, CheckCircle2, AlertTriangle, Settings, Wrench, Cog, RefreshCw,
  Zap, Bot, Brain, Sparkles, Lightbulb, Rocket, Target, Compass, Map, MapPin, Clock, Calendar, Search,
  Award, Star, Heart, ThumbsUp, ArrowRight, ArrowUpRight, ChevronRight, Plus, Check, X,
  Linkedin, Instagram, Facebook, Twitter, Youtube,
} from "lucide-react";

const GROUPS = {
  Security: { ShieldCheck, Shield, ShieldAlert, Lock, Unlock, KeyRound, Fingerprint, Eye, ScanSearch, Bug },
  "Cloud & devices": { Cloud, CloudUpload, Server, ServerCog, Database, HardDrive, Archive, Cpu, Monitor, MonitorCheck, Laptop, Smartphone, Tablet, Printer },
  Network: { Wifi, Network, Router, Globe, Workflow, Layers, Puzzle, Infinity: InfinityIcon },
  Support: { Mail, Phone, MessageSquare, Headphones, LifeBuoy, Bell },
  "People & business": { Users, User, UserCheck, Handshake, Building2, Briefcase, Factory, HardHat, Truck, Package, Box },
  Industries: { HeartPulse, Stethoscope, Scale, Landmark, GraduationCap },
  Data: { BarChart3, LineChart, PieChart, TrendingUp, Activity, Gauge, DollarSign },
  "Docs & tools": { FileText, FolderOpen, ClipboardCheck, CheckCircle2, AlertTriangle, Settings, Wrench, Cog, RefreshCw },
  Ideas: { Zap, Bot, Brain, Sparkles, Lightbulb, Rocket, Target, Compass, Map, MapPin, Clock, Calendar, Search },
  General: { Award, Star, Heart, ThumbsUp, ArrowRight, ArrowUpRight, ChevronRight, Plus, Check, X },
  Social: { Linkedin, Instagram, Facebook, Twitter, Youtube },
};

export const ICON_GROUPS = Object.entries(GROUPS).map(([group, icons]) => ({ group, icons: Object.entries(icons) }));
const ALL = Object.assign({}, ...Object.values(GROUPS));

const cache = {};
// CSS mask url for a library icon; paints with the element's text colour.
export const iconMaskUrl = (name, stroke) => {
  const Icon = ALL[name];
  if (!Icon) return "";
  const k = `${name}|${stroke || 2}`;
  if (!cache[k]) {
    const svg = renderToStaticMarkup(createElement(Icon, { strokeWidth: stroke || 2, color: "#000" }));
    cache[k] = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
  }
  return cache[k];
};
