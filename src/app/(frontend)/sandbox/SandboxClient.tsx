'use client'

import React, { useState, useMemo } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  KeyboardSensor,
  useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { HeroProfileBlock } from '@/blocks/HeroProfileBlock'
import { publishSandbox } from './actions'

type HeadingStyle = 'h1-display' | 'h2-section' | 'h3-subsection'
type Layout = 'split' | 'stacked'
type Container = 'bordered' | 'plain'

type Section = { heading: string; headingStyle: HeadingStyle; items: { label: string; url?: string }[] }

type HeroContent = {
  heading: string
  headingStyle: HeadingStyle
  introduction: string
  sections?: Section[]
}

type HeroStyle = {
  layout: Layout
  imagePosition?: 'left' | 'right'
  container: Container
  bodyFont: string
  headingStyle: HeadingStyle
}

type HeroActions = {
  primary?: { label?: string; link?: string }
  secondary?: { label?: string; link?: string }
}

type BlockProps = {
  content: HeroContent
  media?: { image?: { url: string; alt?: string } }
  actions?: HeroActions
  style?: HeroStyle
}

type CanvasBlock = {
  id: string
  type: 'heroProfile'
  props: BlockProps
}

type Template = {
  type: 'heroProfile'
  label: string
  description: string
  icon: string
  defaultProps: BlockProps
}

const TEMPLATES: Template[] = [
  {
    type: 'heroProfile',
    label: 'Hero Profile',
    description: 'Split layout with heading, intro, and CTAs',
    icon: '👤',
    defaultProps: {
      content: {
        heading: 'Your Name',
        headingStyle: 'h1-display',
        introduction: 'A brief introduction about yourself and what you do best.',
        sections: [
          { heading: 'Known for', headingStyle: 'h3-subsection', items: [] },
          { heading: 'Research', headingStyle: 'h3-subsection', items: [] },
        ],
      },
      media: undefined,
      actions: {
        primary: { label: 'Get in Touch', link: '#' },
        secondary: { label: 'View Work', link: '#' },
      },
      style: {
        layout: 'split',
        imagePosition: 'right',
        container: 'bordered',
        bodyFont: 'inherit',
        headingStyle: 'h1-display',
      },
    },
  },
  {
    type: 'heroProfile',
    label: 'Hero Profile (Stacked)',
    description: 'Centered stacked hero with single CTA',
    icon: '📝',
    defaultProps: {
      content: {
        heading: 'Your Name',
        headingStyle: 'h1-display',
        introduction: 'A brief introduction about yourself and what you do best.',
        sections: [],
      },
      media: undefined,
      actions: {
        primary: { label: 'Get in Touch', link: '#' },
      },
      style: {
        layout: 'stacked',
        imagePosition: 'right',
        container: 'plain',
        bodyFont: 'inherit',
        headingStyle: 'h1-display',
      },
    },
  },
  {
    type: 'heroProfile',
    label: 'Hero Profile (Minimal)',
    description: 'Clean bordered hero with mono font',
    icon: '✨',
    defaultProps: {
      content: {
        heading: 'Your Name',
        headingStyle: 'h2-section',
        introduction: 'Short and sweet intro.',
        sections: [],
      },
      media: undefined,
      actions: {},
      style: {
        layout: 'split',
        imagePosition: 'right',
        container: 'bordered',
        bodyFont: 'mono',
        headingStyle: 'h1-display',
      },
    },
  },
]

function CanvasDropzone({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-dropzone' })
  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 16,
        borderRadius: 12,
        border: isOver ? '2px dashed var(--color-accent, #f97316)' : '2px dashed transparent',
        background: isOver ? 'rgba(249,115,22,0.03)' : 'transparent',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      {children}
    </div>
  )
}

function DraggableTemplate({
  id,
  template,
}: {
  id: string
  template: Template
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...styles.templateItem }}
      {...attributes}
      {...listeners}
    >
      <span style={styles.templateIcon}>{template.icon}</span>
      <div>
        <div style={styles.templateLabel}>{template.label}</div>
        <div style={styles.templateDescription}>{template.description}</div>
      </div>
    </div>
  )
}

function SortableCanvasBlock({
  block,
  isSelected,
  onSelect,
  onDelete,
}: {
  block: CanvasBlock
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...styles.canvasBlock }}
      className={`sandbox-block ${isSelected ? 'sandbox-block--selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      <div
        className="sandbox-block__drag"
        style={styles.canvasBlockDrag}
        {...attributes}
        {...listeners}
      >
        ⋮⋮
      </div>
      <div className="sandbox-block__content" style={styles.canvasBlockContent}>
        <HeroProfileBlock {...block.props} />
      </div>
      <button
        style={styles.canvasBlockDelete}
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        title="Delete block"
      >
        ×
      </button>
    </div>
  )
}

function PropertyEditor({
  block,
  onChange,
  onDelete,
}: {
  block: CanvasBlock
  onChange: (updater: (block: CanvasBlock) => CanvasBlock) => void
  onDelete: () => void
}) {
  if (block.type !== 'heroProfile') return null

  const update = (path: string[], value: unknown) => {
    onChange((prev) => {
      const next = { ...prev }
      let target: Record<string, unknown> = next.props as Record<string, unknown>

      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i]
        const current = target[key]
        target[key] = Array.isArray(current) ? [...current] : { ...(current as Record<string, unknown>) }
        target = target[key] as Record<string, unknown>
      }

      target[path[path.length - 1]] = value
      return next
    })
  }

  const { props } = block

  return (
    <div style={styles.propertiesForm}>
      <div style={styles.propertyGroup}>
        <label style={styles.propertyLabel}>Heading</label>
        <input
          style={styles.propertyInput}
          value={props.content.heading}
          onChange={(e) => update(['content', 'heading'], e.target.value)}
        />
      </div>

      <div style={styles.propertyGroup}>
        <label style={styles.propertyLabel}>Heading Style</label>
        <select
          style={styles.propertySelect}
          value={props.content.headingStyle}
          onChange={(e) => update(['content', 'headingStyle'], e.target.value)}
        >
          <option value="h1-display">H1 / Display</option>
          <option value="h2-section">H2 / Section</option>
          <option value="h3-subsection">H3 / Subsection</option>
        </select>
      </div>

      <div style={styles.propertyGroup}>
        <label style={styles.propertyLabel}>Introduction</label>
        <textarea
          style={{ ...styles.propertyInput, minHeight: 80 }}
          value={props.content.introduction}
          onChange={(e) => update(['content', 'introduction'], e.target.value)}
        />
      </div>

      <div style={styles.propertyGroup}>
        <label style={styles.propertyLabel}>Layout</label>
        <select
          style={styles.propertySelect}
          value={props.style?.layout || 'split'}
          onChange={(e) => update(['style', 'layout'], e.target.value)}
        >
          <option value="split">Split</option>
          <option value="stacked">Stacked</option>
        </select>
      </div>

      <div style={styles.propertyGroup}>
        <label style={styles.propertyLabel}>Container</label>
        <select
          style={styles.propertySelect}
          value={props.style?.container || 'bordered'}
          onChange={(e) => update(['style', 'container'], e.target.value)}
        >
          <option value="bordered">Bordered</option>
          <option value="plain">Plain</option>
        </select>
      </div>

      <div style={styles.propertyGroup}>
        <label style={styles.propertyLabel}>Body Font</label>
        <select
          style={styles.propertySelect}
          value={props.style?.bodyFont || 'inherit'}
          onChange={(e) => update(['style', 'bodyFont'], e.target.value)}
        >
          <option value="inherit">Inherit</option>
          <option value="mono">Mono</option>
          <option value="cambria">Cambria</option>
          <option value="georgia">Georgia</option>
          <option value="playfair-display">Playfair Display</option>
          <option value="merriweather">Merriweather</option>
          <option value="inter">Inter</option>
          <option value="poppins">Poppins</option>
          <option value="space-grotesk">Space Grotesk</option>
        </select>
      </div>

      <div style={styles.propertyGroup}>
        <label style={styles.propertyLabel}>Primary Action Label</label>
        <input
          style={styles.propertyInput}
          value={props.actions?.primary?.label || ''}
          onChange={(e) =>
            update(
              ['actions', 'primary', 'label'],
              e.target.value
            )
          }
        />
      </div>

      <div style={styles.propertyGroup}>
        <label style={styles.propertyLabel}>Primary Action Link</label>
        <input
          style={styles.propertyInput}
          value={props.actions?.primary?.link || ''}
          onChange={(e) =>
            update(
              ['actions', 'primary', 'link'],
              e.target.value
            )
          }
        />
      </div>

      <div style={styles.propertyGroup}>
        <label style={styles.propertyLabel}>Secondary Action Label</label>
        <input
          style={styles.propertyInput}
          value={props.actions?.secondary?.label || ''}
          onChange={(e) =>
            update(
              ['actions', 'secondary', 'label'],
              e.target.value
            )
          }
        />
      </div>

      <div style={styles.propertyGroup}>
        <label style={styles.propertyLabel}>Secondary Action Link</label>
        <input
          style={styles.propertyInput}
          value={props.actions?.secondary?.link || ''}
          onChange={(e) =>
            update(
              ['actions', 'secondary', 'link'],
              e.target.value
            )
          }
        />
      </div>

      <button style={styles.deleteButton} onClick={onDelete}>
        Delete Block
      </button>
    </div>
  )
}

export default function SandboxClient() {
  const [blocks, setBlocks] = useState<CanvasBlock[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [pageTitle, setPageTitle] = useState('My Sandbox Page')
  const [publishing, setPublishing] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const selectedBlock = useMemo(
    () => blocks.find((b) => b.id === selectedId) || null,
    [blocks, selectedId]
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeIdStr = active.id as string
    const overIdStr = over.id as string

    if (activeIdStr.startsWith('template-')) {
      const templateType = activeIdStr.replace('template-', '')
      const template = TEMPLATES.find((t) => t.type === templateType)
      if (!template) return

      const newBlock: CanvasBlock = {
        id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        type: template.type,
        props: JSON.parse(JSON.stringify(template.defaultProps)),
      }

      if (overIdStr === 'canvas-dropzone' || overIdStr.startsWith('block-')) {
        if (overIdStr === 'canvas-dropzone') {
          setBlocks((prev) => [...prev, newBlock])
        } else {
          const overIndex = blocks.findIndex((b) => b.id === overIdStr)
          if (overIndex >= 0) {
            const newBlocks = [...blocks]
            newBlocks.splice(overIndex, 0, newBlock)
            setBlocks(newBlocks)
          }
        }
        setSelectedId(newBlock.id)
      }
      return
    }

    if (activeIdStr.startsWith('block-') && overIdStr.startsWith('block-')) {
      const oldIndex = blocks.findIndex((b) => b.id === activeIdStr)
      const newIndex = blocks.findIndex((b) => b.id === overIdStr)
      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        setBlocks(arrayMove(blocks, oldIndex, newIndex))
      }
    }
  }

  const updateBlock = (id: string, updater: (block: CanvasBlock) => CanvasBlock) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? updater(b) : b)))
  }

  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const handlePublish = async () => {
    setPublishing(true)
    setPublishedUrl(null)
    try {
      const payloadBlocks = blocks.map((b) => ({
        blockType: b.type,
        ...b.props,
      }))
      const result = await publishSandbox({
        title: pageTitle,
        blocks: payloadBlocks,
      })
      setPublishedUrl(`/pages/${result.slug}`)
    } catch (err) {
      console.error('Publish failed', err)
      alert('Failed to publish. Check console for details.')
    } finally {
      setPublishing(false)
    }
  }

  const activeTemplate = activeId
    ? TEMPLATES.find((t) => `template-${t.type}` === activeId)
    : null

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>◆</span>
          <span style={styles.headerTitle}>Portfolio Sandbox</span>
        </div>
        <div style={styles.headerRight}>
          <input
            style={styles.titleInput}
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            placeholder="Page title"
          />
          <button
            style={{ ...styles.publishButton, opacity: publishing ? 0.7 : 1 }}
            onClick={handlePublish}
            disabled={publishing || blocks.length === 0}
          >
            {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {publishedUrl && (
        <div style={styles.toast}>
          Published!{' '}
          <a href={publishedUrl} style={styles.toastLink}>
            View page
          </a>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div style={styles.body}>
          {/* Left Panel - Templates */}
          <div style={styles.leftPanel}>
            <div style={styles.panelHeader}>Templates</div>
            <SortableContext
              items={TEMPLATES.map((t) => `template-${t.type}`)}
              strategy={verticalListSortingStrategy}
            >
              <div style={styles.templateList}>
                {TEMPLATES.map((template) => (
                  <DraggableTemplate
                    key={template.type}
                    id={`template-${template.type}`}
                    template={template}
                  />
                ))}
              </div>
            </SortableContext>
          </div>

          {/* Middle - Canvas */}
          <div style={styles.canvas}>
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <CanvasDropzone>
                {blocks.length === 0 && (
                  <div style={styles.emptyCanvas}>
                    <div style={styles.emptyCanvasIcon}>📦</div>
                    <div style={styles.emptyCanvasText}>
                      Drag templates here to build your page
                    </div>
                  </div>
                )}
                {blocks.map((block) => (
                  <SortableCanvasBlock
                    key={block.id}
                    block={block}
                    isSelected={selectedId === block.id}
                    onSelect={() => setSelectedId(block.id)}
                    onDelete={() => deleteBlock(block.id)}
                  />
                ))}
              </CanvasDropzone>
            </SortableContext>

            <DragOverlay>
              {activeTemplate ? (
                <div style={styles.dragOverlay}>
                  <span style={styles.dragOverlayIcon}>{activeTemplate.icon}</span>
                  <span style={styles.dragOverlayLabel}>{activeTemplate.label}</span>
                </div>
              ) : null}
              {activeId && activeId.startsWith('block-') && !activeTemplate ? (
                <div style={styles.dragOverlay}>
                  {blocks.find((b) => b.id === activeId)?.props.content.heading || 'Block'}
                </div>
              ) : null}
            </DragOverlay>
          </div>

          {/* Right Panel - Customization */}
          <div style={styles.rightPanel}>
            <div style={styles.panelHeader}>Customize</div>
            {selectedBlock ? (
              <div style={styles.properties}>
                <PropertyEditor
                  block={selectedBlock}
                  onChange={(updater) => updateBlock(selectedBlock.id, updater)}
                  onDelete={() => deleteBlock(selectedBlock.id)}
                />
              </div>
            ) : (
              <div style={styles.emptyProperties}>
                Select a block on the canvas to customize its properties.
              </div>
            )}
          </div>
        </div>
      </DndContext>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    fontFamily: 'var(--font-body, inherit)',
    color: 'var(--color-text, #0f172a)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    borderBottom: '1px solid #e2e8f0',
    background: '#ffffff',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 20,
    color: 'var(--color-accent, #f97316)',
  },
  headerTitle: {
    fontWeight: 600,
    fontSize: 16,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  titleInput: {
    padding: '6px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    minWidth: 200,
  },
  publishButton: {
    padding: '8px 20px',
    background: 'var(--color-accent, #f97316)',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 14,
  },
  toast: {
    padding: '10px 24px',
    background: '#f0fdf4',
    color: '#166534',
    borderBottom: '1px solid #bbf7d0',
    fontSize: 14,
    textAlign: 'center',
    flexShrink: 0,
  },
  toastLink: {
    color: '#15803d',
    textDecoration: 'underline',
    fontWeight: 600,
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  leftPanel: {
    width: 260,
    borderRight: '1px solid #e2e8f0',
    background: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  panelHeader: {
    padding: '16px',
    fontWeight: 600,
    fontSize: 13,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: '#64748b',
    borderBottom: '1px solid #e2e8f0',
  },
  templateList: {
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    overflowY: 'auto' as const,
  },
  templateItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    cursor: 'grab',
    userSelect: 'none' as const,
  },
  templateIcon: {
    fontSize: 20,
    width: 32,
    textAlign: 'center',
  },
  templateLabel: {
    fontWeight: 600,
    fontSize: 13,
  },
  templateDescription: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  canvas: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: 24,
    background: '#f1f5f9',
  },
  emptyCanvas: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 80,
    color: '#94a3b8',
    textAlign: 'center' as const,
  },
  emptyCanvasIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyCanvasText: {
    fontSize: 14,
    maxWidth: 280,
    lineHeight: 1.5,
  },
  canvasBlock: {
    position: 'relative' as const,
    borderRadius: 8,
    border: '2px solid transparent',
    overflow: 'hidden',
    transition: 'border-color 0.15s',
  },
  canvasBlockDrag: {
    position: 'absolute' as const,
    top: 8,
    left: 8,
    padding: '4px 8px',
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid #e2e8f0',
    borderRadius: 4,
    cursor: 'grab',
    fontSize: 12,
    color: '#64748b',
    zIndex: 10,
    userSelect: 'none' as const,
  },
  canvasBlockContent: {
    pointerEvents: 'none' as const,
  },
  canvasBlockDelete: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid #e2e8f0',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: 16,
    color: '#ef4444',
    zIndex: 10,
  },
  rightPanel: {
    width: 300,
    borderLeft: '1px solid #e2e8f0',
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column' as const,
    flexShrink: 0,
    overflowY: 'auto' as const,
  },
  emptyProperties: {
    padding: 24,
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center' as const,
  },
  properties: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  propertiesForm: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  propertyGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
  },
  propertyLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#475569',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  propertyInput: {
    padding: '8px 10px',
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
  },
  propertySelect: {
    padding: '8px 10px',
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    fontSize: 13,
    outline: 'none',
    background: '#fff',
    fontFamily: 'inherit',
  },
  deleteButton: {
    marginTop: 16,
    padding: '10px',
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
  },
  dragOverlay: {
    padding: '12px 16px',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    fontWeight: 600,
  },
  dragOverlayIcon: {
    fontSize: 16,
  },
  dragOverlayLabel: {
    fontSize: 13,
  },
}
