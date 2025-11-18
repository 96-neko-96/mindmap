// Language translations
export const translations = {
  ja: {
    // Toolbar
    lines: 'ライン',
    connectionSettings: '接続線設定',
    style: 'スタイル',
    curved: '曲線',
    straight: '直線',
    angled: '角度',
    color: '色',
    width: '太さ',
    close: '閉じる',
    switchToLight: 'ライトモードに切り替え',
    switchToDark: 'ダークモードに切り替え',
    zoomOut: 'ズームアウト',
    zoomIn: 'ズームイン',
    resetView: 'ビューをリセット',
    reset: 'リセット',

    // SidePanel
    nodeProperties: 'ノードプロパティ',
    styleTab: 'スタイル',
    infoTab: '情報',
    selectNode: 'ノードを選択してカスタマイズ',
    shape: '形状',
    rectangle: '長方形',
    rounded: '角丸',
    ellipse: '楕円',
    size: 'サイズ',
    fontSize: 'フォントサイズ',
    fontFamily: 'フォント',
    textStyle: 'テキストスタイル',
    border: '枠線',
    solid: '実線',
    dashed: '破線',
    icon: 'アイコン',
    selectIcon: 'アイコンを選択',
    iconPosition: 'アイコン位置',
    before: '前',
    after: '後',
    nodeId: 'ノードID',
    text: 'テキスト',
    position: '位置',
    children: '子ノード',
    addChildNode: '子ノードを追加',
    deleteNode: 'ノードを削除',

    // IconPicker
    searchIcons: 'アイコンを検索...',
    removeIcon: 'アイコンを削除',

    // Common
    language: '言語',
  },
  en: {
    // Toolbar
    lines: 'Lines',
    connectionSettings: 'Connection Settings',
    style: 'Style',
    curved: 'Curved',
    straight: 'Straight',
    angled: 'Angled',
    color: 'Color',
    width: 'Width',
    close: 'Close',
    switchToLight: 'Switch to Light Mode',
    switchToDark: 'Switch to Dark Mode',
    zoomOut: 'Zoom Out',
    zoomIn: 'Zoom In',
    resetView: 'Reset View',
    reset: 'Reset',

    // SidePanel
    nodeProperties: 'Node Properties',
    styleTab: 'Style',
    infoTab: 'Info',
    selectNode: 'Select a node to customize',
    shape: 'Shape',
    rectangle: 'Rectangle',
    rounded: 'Rounded',
    ellipse: 'Ellipse',
    size: 'Size',
    fontSize: 'Font Size',
    fontFamily: 'Font',
    textStyle: 'Text Style',
    border: 'Border',
    solid: 'Solid',
    dashed: 'Dashed',
    icon: 'Icon',
    selectIcon: 'Select Icon',
    iconPosition: 'Icon Position',
    before: 'Before',
    after: 'After',
    nodeId: 'Node ID',
    text: 'Text',
    position: 'Position',
    children: 'Children',
    addChildNode: 'Add Child Node',
    deleteNode: 'Delete Node',

    // IconPicker
    searchIcons: 'Search icons...',
    removeIcon: 'Remove icon',

    // Common
    language: 'Language',
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.ja;
