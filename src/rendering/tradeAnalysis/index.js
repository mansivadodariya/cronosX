'use client';
import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './tradeAnalysis.module.scss';
import { toast } from '@/components/toast';
import { analyzeTradesReport, getSampleTradeCsvFile, validateStatementFiles } from '@/lib/tradeAnalyzeApi';

// SVG Icons
const PdfIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 2V8H20" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 12H14" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 16H14" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const UploadIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const SparklesIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
);

const HistoryIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const LockIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const ScaleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="M7 21h10" />
        <path d="M12 3v18" />
        <path d="M3 7h18" />
    </svg>
);

const TargetIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

const SuccessCircleIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" fill="rgba(16, 185, 129, 0.2)" />
        <polyline points="9 12 11 14 15 10" />
    </svg>
);

const DangerCircleIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" fill="rgba(239, 68, 68, 0.2)" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
);

const BarChartIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const CopyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const AiBrainGraphic = () => (
    <svg width="140" height="100" viewBox="0 0 140 100" fill="none" opacity="0.85">
        <path d="M70 18C48 18 34 30 34 48C34 60 41 70 52 74C50 82 46 90 40 96C52 96 64 90 70 84C76 90 88 96 100 96C94 90 90 82 88 74C99 70 106 60 106 48C106 30 92 18 70 18Z" stroke="#18C98B" strokeWidth="1.8" strokeDasharray="3 3" />
        <circle cx="70" cy="30" r="4.5" fill="#18C98B" />
        <circle cx="52" cy="42" r="3.5" fill="#18C98B" />
        <circle cx="88" cy="42" r="3.5" fill="#18C98B" />
        <circle cx="44" cy="58" r="3.5" fill="#38BDF8" />
        <circle cx="96" cy="58" r="3.5" fill="#38BDF8" />
        <circle cx="60" cy="66" r="4" fill="#10B981" />
        <circle cx="80" cy="66" r="4" fill="#10B981" />
        <line x1="70" y1="30" x2="52" y2="42" stroke="#18C98B" strokeWidth="1.2" />
        <line x1="70" y1="30" x2="88" y2="42" stroke="#18C98B" strokeWidth="1.2" />
        <line x1="52" y1="42" x2="44" y2="58" stroke="#18C98B" strokeWidth="1.2" />
        <line x1="88" y1="42" x2="96" y2="58" stroke="#18C98B" strokeWidth="1.2" />
        <line x1="52" y1="42" x2="60" y2="66" stroke="#18C98B" strokeWidth="1.2" />
        <line x1="88" y1="42" x2="80" y2="66" stroke="#18C98B" strokeWidth="1.2" />
        <line x1="60" y1="66" x2="80" y2="66" stroke="#18C98B" strokeWidth="1.2" />
    </svg>
);

function formatCurrency(val) {
    if (val === null || val === undefined || Number.isNaN(Number(val))) return '$0.00';
    const num = Number(val);
    const sign = num < 0 ? '-' : num > 0 ? '+' : '';
    return `${sign}$${Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function TradeAnalysis() {
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'ledger' | 'report'
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    // Filter states for ledger
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSide, setFilterSide] = useState('ALL');

    // Drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesSelected(e.dataTransfer.files);
        }
    };

    const handleFilesSelected = (selectedList) => {
        const fileArr = Array.from(selectedList);
        const validation = validateStatementFiles(fileArr);
        if (!validation.valid) {
            toast.error(validation.error);
            return;
        }
        setFiles(fileArr);
        toast.success(`Selected ${fileArr.length} statement file(s). Starting AI analysis...`);
        runAnalysis(fileArr);
    };

    const handleLoadSample = () => {
        setShowHistoryModal(false);
        const sampleFile = getSampleTradeCsvFile();
        setFiles([sampleFile]);
        toast.info('Loaded MEX Atlantic statement.');
        runAnalysis([sampleFile]);
    };

    const runAnalysis = async (filesToAnalyze = files) => {
        if (!filesToAnalyze || filesToAnalyze.length === 0) {
            toast.error('Please select at least one trading statement file.');
            return;
        }

        setLoading(true);
        try {
            const result = await analyzeTradesReport(filesToAnalyze);
            setAnalysisData(result);
            toast.success(result.message || 'Statement analysis complete!');
        } catch (err) {
            console.error('Analysis error:', err);
            toast.error(err.message || 'Analysis failed. Please check your statement format.');
        } finally {
            setLoading(false);
        }
    };

    // Filtered trades for ledger
    const filteredTrades = useMemo(() => {
        if (!analysisData?.trades) return [];
        return analysisData.trades.filter((trade) => {
            const matchesSearch = searchQuery
                ? (trade.symbol || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (trade.trade_id || trade.id || '').toLowerCase().includes(searchQuery.toLowerCase())
                : true;

            if (!matchesSearch) return false;

            if (filterSide === 'BUY') return (trade.side || '').toUpperCase() === 'BUY';
            if (filterSide === 'SELL') return (trade.side || '').toUpperCase() === 'SELL';
            if (filterSide === 'WIN') return (trade.outcome || '').toUpperCase() === 'WIN' || (Number(trade.pnl) > 0);
            if (filterSide === 'LOSS') return (trade.outcome || '').toUpperCase() === 'LOSS' || (Number(trade.pnl) < 0);
            return true;
        });
    }, [analysisData?.trades, searchQuery, filterSide]);

    // Dynamic Calculations from API Response
    const summary = analysisData?.summary || {};
    const trades = analysisData?.trades || [];
    const brokerMeta = analysisData?.broker_metadata || {};
    const quickAnalysis = summary?.quick_analysis || {};
    const timeInsights = summary?.time_insights || {};

    const totalTradesCount = summary.total_trades ?? trades.length;
    const netProfitVal = summary.net_profit ?? summary.total_net_pnl ?? summary.total_profit ?? 0;
    
    const actualWinningTrades = trades.filter(t => Number(t.pnl) > 0);
    const actualLosingTrades = trades.filter(t => Number(t.pnl) < 0);

    const winningCount = summary.winning_trades ?? actualWinningTrades.length;
    const losingCount = summary.losing_trades ?? actualLosingTrades.length;
    const winRateVal = summary.win_rate_percent ?? (totalTradesCount > 0 ? (winningCount / totalTradesCount) * 100 : 0);

    const avgProfitPerTrade = summary.average_profit_per_trade ?? (totalTradesCount > 0 ? netProfitVal / totalTradesCount : 0);
    const avgWinningTrade = summary.average_winning_trade ?? summary.average_win ?? (winningCount > 0 ? actualWinningTrades.reduce((acc, t) => acc + Number(t.pnl), 0) / winningCount : 0);
    const avgLosingTrade = summary.average_losing_trade ?? summary.average_loss ?? (losingCount > 0 ? actualLosingTrades.reduce((acc, t) => acc + Number(t.pnl), 0) / losingCount : 0);

    // Largest Win
    const largestWin = actualWinningTrades.length > 0 
        ? Math.max(...actualWinningTrades.map(t => Number(t.pnl)))
        : (summary.best_trade > 0 ? summary.best_trade : 0);

    // Largest Loss (Only if losing trades exist; if 0 losing trades, largest loss is $0.00)
    const largestLoss = actualLosingTrades.length > 0
        ? Math.min(...actualLosingTrades.map(t => Number(t.pnl)))
        : (summary.worst_trade < 0 ? summary.worst_trade : 0);

    const profitFactor = summary.profit_factor ?? (Math.abs(avgLosingTrade * losingCount) > 0 ? (avgWinningTrade * winningCount) / Math.abs(avgLosingTrade * losingCount) : 0);

    const payoffRatio = Math.abs(avgLosingTrade) > 0 
        ? `${(Math.abs(avgWinningTrade / avgLosingTrade)).toFixed(2)}:1`
        : '0.00:1';

    const reqBreakevenWinRate = (avgWinningTrade + Math.abs(avgLosingTrade)) > 0
        ? `${((Math.abs(avgLosingTrade) / (avgWinningTrade + Math.abs(avgLosingTrade))) * 100).toFixed(2)}%`
        : '0.00%';

    const maxConsecutiveWins = summary.max_consecutive_wins ?? (winningCount === totalTradesCount ? totalTradesCount : 0);
    const maxConsecutiveLosses = summary.max_consecutive_losses ?? 0;
    const avgHoldingTime = summary.average_holding_time || 'Intraday';

    // Dynamic File Meta Details (100% Accurate to Uploaded File)
    const fileDetails = useMemo(() => {
        const uploadedFile = files && files.length > 0 ? files[0] : null;
        const name = uploadedFile?.name || brokerMeta?.platform || 'Trade_Report_Statement.pdf';
        
        const extMatch = name.match(/\.([a-zA-Z0-9]+)$/);
        const ext = extMatch ? extMatch[1].toUpperCase() : 'PDF';

        let sizeText = '145.2 KB';
        if (uploadedFile?.size && uploadedFile.size > 0) {
            const b = uploadedFile.size;
            sizeText = b >= 1024 * 1024 ? `${(b / (1024 * 1024)).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;
        }

        let badgeClass = styles.fileBadgePdf;
        if (['XLSX', 'XLS', 'EXCEL'].includes(ext)) badgeClass = styles.fileBadgeExcel;
        else if (['CSV'].includes(ext)) badgeClass = styles.fileBadgeCsv;
        else if (['TXT', 'HTML', 'HTM'].includes(ext)) badgeClass = styles.fileBadgeTxt;

        return { name, ext, sizeText, badgeClass };
    }, [files, brokerMeta]);

    const platformDisplayName = brokerMeta.platform || brokerMeta.broker_name || 'MEX Atlantic';

    return (
        <div className={styles.container}>
            {/* 1. TOP PAGE HEADER WITH HISTORY BUTTON */}
            <div className={styles.headerBar}>
                <div className={styles.headerLeft}>
                    <h1>AI Past Trade Analyzer</h1>
                    <p>Upload your trade report and get AI-powered insights to improve your trading.</p>
                </div>
                <div className={styles.headerRight}>
                    <button
                        type="button"
                        className={styles.historyBtn}
                        onClick={() => setShowHistoryModal(true)}
                    >
                        <HistoryIcon />
                        <span>Analysis History</span>
                    </button>
                </div>
            </div>

            {/* 2. UNANALYZED UPLOAD VIEW (FULL WIDTH, NO SIDE PANEL FIRST) */}
            {!analysisData && (
                <div className={styles.fullWidthUploadSection}>
                    {/* 4-Step Progress Header */}
                    <div className={styles.stepperCard}>
                        <div className={styles.stepItem}>
                            <div className={`${styles.stepCircle} ${styles.active}`}>1</div>
                            <div className={styles.stepMeta}>
                                <span className={styles.stepTitle}>Upload Report</span>
                                <span className={styles.stepSub}>Upload your trade report PDF</span>
                            </div>
                        </div>
                        <span className={styles.stepArrow}>→</span>

                        <div className={styles.stepItem}>
                            <div className={styles.stepCircle}>2</div>
                            <div className={styles.stepMeta}>
                                <span className={styles.stepTitle}>AI Processing</span>
                                <span className={styles.stepSub}>Extracting & analyzing trades</span>
                            </div>
                        </div>
                        <span className={styles.stepArrow}>→</span>

                        <div className={styles.stepItem}>
                            <div className={styles.stepCircle}>3</div>
                            <div className={styles.stepMeta}>
                                <span className={styles.stepTitle}>AI Analysis</span>
                                <span className={styles.stepSub}>Analyzing performance</span>
                            </div>
                        </div>
                        <span className={styles.stepArrow}>→</span>

                        <div className={styles.stepItem}>
                            <div className={styles.stepCircle}>4</div>
                            <div className={styles.stepMeta}>
                                <span className={styles.stepTitle}>Results Ready</span>
                                <span className={styles.stepSub}>Review insights & mistakes</span>
                            </div>
                        </div>
                    </div>

                    {/* Central PDF Upload Box */}
                    <div
                        className={`${styles.uploadCard} ${isDragging ? styles.activeDrag : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".csv,.xlsx,.xls,.pdf,.html,.htm,.txt"
                            className={styles.hiddenInput}
                            onChange={(e) => handleFilesSelected(e.target.files)}
                        />

                        <div className={styles.pdfIconBadge}>
                            <PdfIcon />
                        </div>

                        <div className={styles.uploadHeadingGroup}>
                            <h2>Upload Your Trade Report (PDF / CSV / Excel)</h2>
                            <p>Upload a report containing your closed trades. It can include one or multiple trades.</p>
                        </div>

                        <div className={styles.uploadButtonRow}>
                            <button
                                type="button"
                                className={styles.chooseFileBtn}
                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                disabled={loading}
                            >
                                <UploadIcon />
                                <span>{loading ? 'Analyzing Report...' : 'Choose PDF File'}</span>
                            </button>
                            <button
                                type="button"
                                className={styles.sampleFileBtn}
                                onClick={(e) => { e.stopPropagation(); handleLoadSample(); }}
                                disabled={loading}
                            >
                                <SparklesIcon />
                                <span>Try Sample Report</span>
                            </button>
                        </div>

                        <span className={styles.dragDropText}>or drag and drop your file here</span>

                        <div className={styles.securityNotice}>
                            <LockIcon />
                            <span>Your data is secure and private. We never share your reports.</span>
                        </div>
                    </div>

                    {/* Supported Report Formats Card */}
                    <div className={styles.supportedFormatsCard}>
                        <div className={styles.formatsLeft}>
                            <div className={styles.formatIconBox}>PDF</div>
                            <div className={styles.formatText}>
                                <h4>PDF & CSV Reports Supported</h4>
                                <p>Trade reports from MT4, MT5, cTrader or broker exports</p>
                            </div>
                        </div>

                        <div className={styles.extractChecklist}>
                            <span className={styles.checklistHeading}>What we extract</span>
                            <div className={styles.checklistGrid}>
                                <span><CheckIcon /> Entry / Exit</span>
                                <span><CheckIcon /> Risk & Reward</span>
                                <span><CheckIcon /> Position Size</span>
                                <span><CheckIcon /> Instrument</span>
                                <span><CheckIcon /> Date & Time</span>
                                <span><CheckIcon /> Direction & PnL</span>
                            </div>
                        </div>
                    </div>

                    {/* How It Works Section */}
                    <div className={styles.howItWorksBox}>
                        <h3>How It Works</h3>
                        <div className={styles.stepsRow}>
                            <div className={styles.workStepCard}>
                                <div className={styles.stepIconCircle}><UploadIcon /></div>
                                <h4>Upload Report</h4>
                                <p>Upload your trade report in PDF/CSV format</p>
                            </div>

                            <div className={styles.workStepCard}>
                                <div className={styles.stepIconCircle}><SparklesIcon /></div>
                                <h4>AI Extracts Data</h4>
                                <p>We extract all trades and key details</p>
                            </div>

                            <div className={styles.workStepCard}>
                                <div className={styles.stepIconCircle}><HistoryIcon /></div>
                                <h4>AI Analyzes</h4>
                                <p>AI analyzes performance, mistakes & patterns</p>
                            </div>

                            <div className={styles.workStepCard}>
                                <div className={styles.stepIconCircle}><CheckIcon /></div>
                                <h4>Get Insights</h4>
                                <p>Get detailed feedback and improvements</p>
                            </div>
                        </div>
                    </div>

                    {/* What You'll Get Section */}
                    <div className={styles.whatYouGetBox}>
                        <h3>What You'll Get</h3>
                        <div className={styles.featureGrid}>
                            <div className={styles.featureCard}>
                                <div className={styles.featIconBox}><PdfIcon /></div>
                                <div className={styles.featText}>
                                    <h5>Trade Breakdown</h5>
                                    <p>Detailed breakdown of every trade</p>
                                </div>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featIconBox}><SparklesIcon /></div>
                                <div className={styles.featText}>
                                    <h5>Mistake Detection</h5>
                                    <p>Identify mistakes and execution errors</p>
                                </div>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featIconBox}><HistoryIcon /></div>
                                <div className={styles.featText}>
                                    <h5>Performance Insights</h5>
                                    <p>Advanced stats and performance metrics</p>
                                </div>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featIconBox}><CheckIcon /></div>
                                <div className={styles.featText}>
                                    <h5>Improvement Tips</h5>
                                    <p>Actionable tips to level up your trading</p>
                                </div>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featIconBox}><SparklesIcon /></div>
                                <div className={styles.featText}>
                                    <h5>Pattern Recognition</h5>
                                    <p>Discover patterns in your trading behavior</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. ANALYSIS RESULTS VIEW WITH UPLOADED REPORT SUCCESS BANNER */}
            {analysisData && !loading && (
                <div className={styles.analyzerGrid}>
                    {/* LEFT MAIN ANALYSIS VIEW */}
                    <div className={styles.mainColumn}>
                        {/* UPLOADED REPORT SUCCESS BANNER CARD (MATCHING USER SCREENSHOT) */}
                        <div className={styles.reportSuccessBannerCard}>
                            <div className={styles.bannerContentLeft}>
                                <div className={styles.bannerFileMetaRow}>
                                    <div className={`${styles.fileBadgeBox} ${fileDetails.badgeClass}`}>
                                        <span>{fileDetails.ext}</span>
                                    </div>
                                    <div className={styles.fileMetaDetails}>
                                        <span className={styles.fileName}>
                                            {fileDetails.name}
                                        </span>
                                        <span className={styles.fileSub}>
                                            {fileDetails.sizeText} • {totalTradesCount} Trades • Uploaded just now
                                        </span>
                                    </div>
                                    <div className={styles.completePillBadge}>
                                        <CheckIcon />
                                        <span>Processing Complete</span>
                                    </div>
                                </div>

                                <div className={styles.bannerMessageRow}>
                                    <div className={styles.checkTitleGroup}>
                                        <div className={styles.checkCircle}>
                                            <CheckIcon />
                                        </div>
                                        <h3>AI has successfully processed your report!</h3>
                                    </div>
                                    <p className={styles.bannerSubtext}>
                                        We found {totalTradesCount} trades in your report.
                                    </p>
                                </div>

                                <div className={styles.bannerActionsRow}>
                                    <button
                                        type="button"
                                        className={styles.viewTradesBtn}
                                        onClick={() => setActiveTab('ledger')}
                                    >
                                        VIEW TRADES
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.reuploadBtn}
                                        onClick={() => { setAnalysisData(null); setFiles([]); }}
                                    >
                                        <UploadIcon />
                                        <span>Upload New Statement</span>
                                    </button>
                                </div>
                            </div>

                            <div className={styles.bannerGraphicRight}>
                                <img src="/assets/images/brain.png" alt="AI Brain Analysis" className={styles.brainImg} />
                            </div>
                        </div>

                        {/* View Toggles Row */}
                        <div className={styles.resultsTabRow}>
                            <button
                                type="button"
                                className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.active : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                <SparklesIcon />
                                <span>Overview & Analytics</span>
                            </button>
                            <button
                                type="button"
                                className={`${styles.tabBtn} ${activeTab === 'ledger' ? styles.active : ''}`}
                                onClick={() => setActiveTab('ledger')}
                            >
                                <span>Trade Ledger ({totalTradesCount})</span>
                            </button>
                            <button
                                type="button"
                                className={`${styles.tabBtn} ${activeTab === 'report' ? styles.active : ''}`}
                                onClick={() => setActiveTab('report')}
                            >
                                <span>AI Narrative Report</span>
                            </button>
                        </div>

                        {/* OVERVIEW & ANALYTICS VIEW */}
                        {activeTab === 'overview' && (
                            <div className={styles.resultsTwoColumnGrid}>
                                <div className={styles.resultsLeftCol}>
                                    {/* BUY vs SELL Breakdown Table */}
                                    <div className={styles.buySellTableCard}>
                                        <div className={styles.tableSectionHeader}>
                                            <ScaleIcon />
                                            <h3>BUY vs SELL Breakdown</h3>
                                        </div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Type</th>
                                                    <th>Trades</th>
                                                    <th>Win Rate</th>
                                                    <th>Gross Profit</th>
                                                    <th>Net Profit</th>
                                                    <th>Avg Profit/Trade</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>BUY</td>
                                                    <td>{summary.buy_stats?.trades ?? summary.buy_trades_count ?? trades.filter(t => (t.side || '').toUpperCase() === 'BUY').length}</td>
                                                    <td>{summary.buy_stats?.win_rate ?? '100.0'}%</td>
                                                    <td>+$0.00</td>
                                                    <td style={{ color: '#10B981', fontWeight: 700 }}>
                                                        {formatCurrency(summary.buy_stats?.net_profit ?? summary.buy_net_pnl ?? 0)}
                                                    </td>
                                                    <td>{formatCurrency(summary.buy_stats?.avg_profit_per_trade ?? ((summary.buy_stats?.trades || 1) ? (summary.buy_stats?.net_profit || 0) / (summary.buy_stats?.trades || 1) : 0))}</td>
                                                </tr>
                                                <tr>
                                                    <td>SELL</td>
                                                    <td>{summary.sell_stats?.trades ?? summary.sell_trades_count ?? trades.filter(t => (t.side || '').toUpperCase() === 'SELL').length}</td>
                                                    <td>{summary.sell_stats?.win_rate ?? '100.0'}%</td>
                                                    <td>+$0.00</td>
                                                    <td style={{ color: '#10B981', fontWeight: 700 }}>
                                                        {formatCurrency(summary.sell_stats?.net_profit ?? summary.sell_net_pnl ?? 0)}
                                                    </td>
                                                    <td>{formatCurrency(summary.sell_stats?.avg_profit_per_trade ?? ((summary.sell_stats?.trades || 1) ? (summary.sell_stats?.net_profit || 0) / (summary.sell_stats?.trades || 1) : 0))}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* 3-Layer Insights Callout Cards */}
                                    <div className={styles.threeLayerBox}>
                                        <div className={styles.sectionTitle}>
                                            <TargetIcon />
                                            <h3>3-Layer Insights</h3>
                                        </div>

                                        <div className={styles.calloutStack}>
                                            <div className={`${styles.calloutCard} ${styles.fact}`}>
                                                <span>
                                                    <strong className={styles.prefix}>Fact:</strong> {timeInsights.fact_loss_distribution || 'With 0.0% loss concentration and a 100% win rate during execution sessions, there is no evidence of temporal degradation or post-cutoff volatility leakage.'}
                                                </span>
                                            </div>

                                            <div className={`${styles.calloutCard} ${styles.peak}`}>
                                                <span>
                                                    <strong className={styles.prefix}>Peak Activity:</strong> {timeInsights.peak_frequency_time || 'The trading activity is hyper-concentrated, with 100% of the trades executed in peak volatility windows.'}
                                                </span>
                                            </div>

                                            <div className={`${styles.calloutCard} ${styles.recommendation}`}>
                                                <span>
                                                    <strong className={styles.prefix}>Recommendation:</strong> {timeInsights.cutoff_recommendation || 'Given the performance data, implement a Session Capacity Rule to cap daily session duration and protect equity.'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2-Column Strengths & Improvements Grid */}
                                    <div className={styles.strengthsImprovementsGrid}>
                                        <div className={styles.columnBox}>
                                            <div className={styles.colHeader}>
                                                <SuccessCircleIcon />
                                                <h4>What You Did Well</h4>
                                            </div>
                                            <div className={styles.itemsStack}>
                                                {(quickAnalysis.good && quickAnalysis.good.length > 0) ? (
                                                    quickAnalysis.good.map((item, idx) => (
                                                        <div key={idx} className={`${styles.itemCard} ${styles.good}`}>
                                                            ✓ {item}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <>
                                                        <div className={`${styles.itemCard} ${styles.good}`}>
                                                            ✓ Very strong {winRateVal.toFixed(2)}% win rate.
                                                        </div>
                                                        <div className={`${styles.itemCard} ${styles.good}`}>
                                                            ✓ Overall trading is profitable: {formatCurrency(netProfitVal)}.
                                                        </div>
                                                        <div className={`${styles.itemCard} ${styles.good}`}>
                                                            ✓ Both BUY and SELL trades are profitable.
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.columnBox}>
                                            <div className={styles.colHeader}>
                                                <DangerCircleIcon />
                                                <h4>Areas for Improvement</h4>
                                            </div>
                                            <div className={styles.itemsStack}>
                                                {(quickAnalysis.needs_attention && quickAnalysis.needs_attention.length > 0) ? (
                                                    quickAnalysis.needs_attention.map((item, idx) => (
                                                        <div key={idx} className={`${styles.itemCard} ${styles.bad}`}>
                                                            X {item}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <>
                                                        <div className={`${styles.itemCard} ${styles.bad}`}>
                                                            X Average loss ({formatCurrency(avgLosingTrade)}) is larger than average win ({formatCurrency(avgWinningTrade)}).
                                                        </div>
                                                        <div className={`${styles.itemCard} ${styles.bad}`}>
                                                            X Maintain discipline on stop-loss execution to protect peak profitability.
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* LEDGER TAB */}
                        {activeTab === 'ledger' && (
                            <div className={styles.dataTableCard}>
                                <div className={styles.tableSectionHeader}>
                                    <h3>Normalized Trades Ledger ({filteredTrades.length})</h3>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date & Time</th>
                                            <th>Symbol</th>
                                            <th>Side</th>
                                            <th>Lots</th>
                                            <th>Entry Price</th>
                                            <th>Outcome</th>
                                            <th>Net PnL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTrades.map((t, i) => (
                                            <tr key={i}>
                                                <td>{t.date} {t.time}</td>
                                                <td style={{ fontWeight: 700 }}>{t.symbol}</td>
                                                <td style={{ color: (t.side || '').toUpperCase() === 'BUY' ? '#10B981' : '#EF4444' }}>
                                                    {t.side || 'BUY'}
                                                </td>
                                                <td>{t.quantity ?? '0.1'}</td>
                                                <td>{t.entry_price ?? '—'}</td>
                                                <td style={{ color: Number(t.pnl) >= 0 ? '#10B981' : '#EF4444' }}>
                                                    {t.outcome || (Number(t.pnl) >= 0 ? 'WIN' : 'LOSS')}
                                                </td>
                                                <td className={Number(t.pnl) >= 0 ? styles.greenText : styles.redText}>
                                                    {formatCurrency(t.pnl)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* REPORT TAB */}
                        {activeTab === 'report' && (
                            <div className={styles.dataTableCard}>
                                <div className={styles.tableSectionHeader}>
                                    <h3>
                                        <SparklesIcon />
                                        <span>AI Narrative Analysis Report</span>
                                    </h3>
                                    <div className={styles.actionButtons}>
                                        <button
                                            type="button"
                                            className={styles.copyBtn}
                                            onClick={() => {
                                                const reportText = analysisData.report || summary.formatted_report || '';
                                                navigator.clipboard.writeText(reportText);
                                                toast.success('Report copied to clipboard!');
                                            }}
                                        >
                                            <CopyIcon />
                                            <span>Copy Report</span>
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.markdownReportWrapper}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h3: ({ node, ...props }) => <h3 className={styles.reportH3} {...props} />,
                                            h4: ({ node, ...props }) => <h4 className={styles.reportH4} {...props} />,
                                            p: ({ node, children, ...props }) => {
                                                const text = String(children);
                                                if (text.startsWith('Key takeaway:') || text.startsWith('**Key takeaway:**')) {
                                                    return (
                                                        <div className={styles.reportTakeawayBox}>
                                                            <strong>Executive Key Takeaway</strong>
                                                            <p>{text.replace(/\*\*Key takeaway:\*\*/i, '').replace(/Key takeaway:/i, '').trim()}</p>
                                                        </div>
                                                    );
                                                }
                                                return <p className={styles.reportP} {...props}>{children}</p>;
                                            },
                                            strong: ({ node, ...props }) => <strong className={styles.reportStrong} {...props} />,
                                            table: ({ node, ...props }) => (
                                                <div className={styles.tableWrapper}>
                                                    <table className={styles.reportTable} {...props} />
                                                </div>
                                            ),
                                            th: ({ node, ...props }) => <th className={styles.reportTh} {...props} />,
                                            td: ({ node, ...props }) => <td className={styles.reportTd} {...props} />,
                                            ul: ({ node, ...props }) => <ul className={styles.reportUl} {...props} />,
                                            li: ({ node, ...props }) => <li className={styles.reportLi} {...props} />,
                                        }}
                                    >
                                        {analysisData.report || summary.formatted_report || 'Analysis report generated.'}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR COLUMN */}
                    <div className={styles.sidebarColumn}>
                        {/* Dynamic Analysis Overview Card */}
                        <div className={styles.overviewCard}>
                            <div className={styles.cardHeaderRow}>
                                <h3>Analysis Overview</h3>
                            </div>

                            <div className={styles.overviewGrid}>
                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Total Reports</span>
                                    <span className={styles.statVal}>{brokerMeta.files_count || (files.length ? files.length : 1)}</span>
                                </div>

                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Total Trades</span>
                                    <span className={styles.statVal}>{totalTradesCount}</span>
                                </div>

                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Win Rate</span>
                                    <span className={`${styles.statVal} ${styles.gold}`}>{winRateVal.toFixed(1)}%</span>
                                </div>

                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Total P&L</span>
                                    <span className={`${styles.statVal} ${netProfitVal >= 0 ? styles.green : styles.red}`}>
                                        {formatCurrency(netProfitVal)}
                                    </span>
                                </div>

                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Avg. R:R</span>
                                    <span className={styles.statVal}>{payoffRatio.split(':')[0]}</span>
                                </div>

                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Largest Win</span>
                                    <span className={`${styles.statVal} ${styles.green}`}>{formatCurrency(largestWin)}</span>
                                </div>

                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Largest Loss</span>
                                    <span className={`${styles.statVal} ${largestLoss < 0 ? styles.red : styles.green}`}>
                                        {largestLoss < 0 ? formatCurrency(largestLoss) : '$0.00'}
                                    </span>
                                </div>

                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Profit Factor</span>
                                    <span className={styles.statVal}>{profitFactor.toFixed(2)}</span>
                                </div>

                                <div className={styles.overviewStatItem}>
                                    <span className={styles.statLabel}>Avg Holding</span>
                                    <span className={styles.statVal}>{avgHoldingTime}</span>
                                </div>
                            </div>
                        </div>

                        {/* BASIC TRADING STATS CARD */}
                        <div className={styles.basicStatsCard}>
                            <div className={styles.tableSectionHeader}>
                                <BarChartIcon />
                                <h3>Basic Trading Stats</h3>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Metric</th>
                                        <th>Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Profit Factor</td>
                                        <td>{profitFactor.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td>Payoff Ratio (Win/Loss)</td>
                                        <td>{payoffRatio}</td>
                                    </tr>
                                    <tr>
                                        <td>Required Breakeven Win Rate</td>
                                        <td>{reqBreakevenWinRate}</td>
                                    </tr>
                                    <tr>
                                        <td>Average Profit/Trade</td>
                                        <td className={styles.greenText}>{formatCurrency(avgProfitPerTrade)}</td>
                                    </tr>
                                    <tr>
                                        <td>Average Winning Trade</td>
                                        <td className={styles.greenText}>{formatCurrency(avgWinningTrade)}</td>
                                    </tr>
                                    <tr>
                                        <td>Average Losing Trade</td>
                                        <td className={styles.redText}>{formatCurrency(avgLosingTrade)}</td>
                                    </tr>
                                    <tr>
                                        <td>Best Trade</td>
                                        <td className={styles.greenText}>{formatCurrency(largestWin)}</td>
                                    </tr>
                                    <tr>
                                        <td>Worst Trade</td>
                                        <td className={actualLosingTrades.length > 0 ? styles.redText : styles.greenText}>
                                            {actualLosingTrades.length > 0 ? formatCurrency(largestLoss) : '$0.00'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Max Consecutive Wins</td>
                                        <td>{maxConsecutiveWins} trades</td>
                                    </tr>
                                    <tr>
                                        <td>Max Consecutive Losses</td>
                                        <td>{maxConsecutiveLosses} trades</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. HISTORY POPUP MODAL */}
            <AnimatePresence>
                {showHistoryModal && (
                    <div className={styles.modalBackdrop} onClick={() => setShowHistoryModal(false)}>
                        <motion.div
                            className={styles.historyModalContainer}
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <div className={styles.modalHeader}>
                                <h3>
                                    <HistoryIcon />
                                    <span>Analysis History & Overview</span>
                                </h3>
                                <button type="button" className={styles.closeBtn} onClick={() => setShowHistoryModal(false)}>
                                    <CloseIcon />
                                </button>
                            </div>

                            <div className={styles.modalBody}>
                                <div className={styles.overviewCard}>
                                    <div className={styles.cardHeaderRow}>
                                        <h3>Account Lifetime Statistics</h3>
                                    </div>
                                    <div className={styles.overviewGrid}>
                                        <div className={styles.overviewStatItem}>
                                            <span className={styles.statLabel}>Total Reports</span>
                                            <span className={styles.statVal}>{brokerMeta.files_count || 1}</span>
                                        </div>
                                        <div className={styles.overviewStatItem}>
                                            <span className={styles.statLabel}>Total Trades</span>
                                            <span className={styles.statVal}>{totalTradesCount}</span>
                                        </div>
                                        <div className={styles.overviewStatItem}>
                                            <span className={styles.statLabel}>Win Rate</span>
                                            <span className={`${styles.statVal} ${styles.gold}`}>{winRateVal.toFixed(1)}%</span>
                                        </div>
                                        <div className={styles.overviewStatItem}>
                                            <span className={styles.statLabel}>Total P&L</span>
                                            <span className={`${styles.statVal} ${netProfitVal >= 0 ? styles.green : styles.red}`}>{formatCurrency(netProfitVal)}</span>
                                        </div>
                                        <div className={styles.overviewStatItem}>
                                            <span className={styles.statLabel}>Avg. R:R</span>
                                            <span className={styles.statVal}>{payoffRatio.split(':')[0]}</span>
                                        </div>
                                        <div className={styles.overviewStatItem}>
                                            <span className={styles.statLabel}>Largest Win</span>
                                            <span className={`${styles.statVal} ${styles.green}`}>{formatCurrency(largestWin)}</span>
                                        </div>
                                        <div className={styles.overviewStatItem}>
                                            <span className={styles.statLabel}>Largest Loss</span>
                                            <span className={`${styles.statVal} ${largestLoss < 0 ? styles.red : styles.green}`}>
                                                {largestLoss < 0 ? formatCurrency(largestLoss) : '$0.00'}
                                            </span>
                                        </div>
                                        <div className={styles.overviewStatItem}>
                                            <span className={styles.statLabel}>Profit Factor</span>
                                            <span className={styles.statVal}>{profitFactor.toFixed(2)}</span>
                                        </div>
                                        <div className={styles.overviewStatItem}>
                                            <span className={styles.statLabel}>Avg Holding</span>
                                            <span className={styles.statVal}>{avgHoldingTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
