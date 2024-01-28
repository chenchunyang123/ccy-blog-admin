import { PageContainer } from '@ant-design/pro-components';
import bytemdPluginBreaks from '@bytemd/plugin-breaks';
import bytemdPluginFrontmatter from '@bytemd/plugin-frontmatter';
import bytemdPluginGemoji from '@bytemd/plugin-gemoji';
import bytemdPluginGfm from '@bytemd/plugin-gfm';
import bytemdPluginHighlight from '@bytemd/plugin-highlight';
import bytemdPluginMath from '@bytemd/plugin-math';
import bytemdPluginMediumZoom from '@bytemd/plugin-medium-zoom';
import bytemdPluginMermaid from '@bytemd/plugin-mermaid';
import { Editor } from '@bytemd/react';
import type { BytemdPlugin } from 'bytemd';
import 'bytemd/dist/index.min.css';
import 'highlight.js/styles/vs.min.css';
import React, { useState } from 'react';

const plugins: BytemdPlugin[] = [
  bytemdPluginBreaks(),
  bytemdPluginFrontmatter(),
  bytemdPluginGemoji(),
  bytemdPluginGfm(),
  bytemdPluginHighlight(),
  bytemdPluginMath(),
  bytemdPluginMediumZoom(),
  bytemdPluginMermaid(),
];

const Welcome: React.FC = () => {
  const [value, setValue] = useState('');

  console.log('value', value);

  return (
    <PageContainer>
      <Editor
        value={value}
        plugins={plugins}
        onChange={(v) => {
          setValue(v);
        }}
      />
    </PageContainer>
  );
};

export default Welcome;
